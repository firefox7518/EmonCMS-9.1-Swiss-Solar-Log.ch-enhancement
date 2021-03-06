<?php

class VirtualFeed
{

    private $mysqli;
    private $process;
    private $feed;
    private $log;

    public function __construct($mysqli,$redis,$feed)
    {
        global $session,$user;
        $this->mysqli = $mysqli;
        $this->feed = $feed;
        $this->log = new EmonLogger(__FILE__);

        require_once "Modules/input/input_model.php";
        $input = new Input($mysqli,$redis, $feed);

        require_once "Modules/process/process_model.php";
        $this->process = new Process($mysqli,$input,$feed,$user->get_timezone($session['userid']));
    }

    public function create($feedid,$options)
    {
        return true;  // Always true
    }

    public function delete($feedid)
    {
        return true; // Always true
    }

    public function get_meta($feedid)
    {
        $meta = new stdClass();
        $meta->id = $feedid;
        $meta->start_time = 0;
        $meta->nlayers = 1;
        $meta->interval = 1;
        return $meta;
    }

    public function get_feed_size($feedid)
    {
        return 0;  // Always 0
    }

    public function post($feedid,$time,$value,$arg=null)
    {
        return false; // Not supported by engine
    }

    public function update($feedid,$time,$value)
    {
        return false; // Not supported by engine
    }

    public function lastvalue($feedid)
    {
        $feedid = intval($feedid);
        $processList = $this->feed->get_processlist($feedid);
        if ($processList == '' || $processList == null) { return false; }
        
        // Check if datatype is daily so that select over range is used rather than skip select approach
        static $feed_datatype_cache = array(); // Array to hold the cache
        if (isset($feed_datatype_cache[$feedid])) {
            $datatype = $feed_datatype_cache[$feedid]; // Retrieve from static cache
        } else {
            $result = $this->mysqli->query("SELECT datatype FROM feeds WHERE `id` = '$feedid'");
            $row = $result->fetch_array();
            $datatype = $row['datatype'];
            $feed_datatype_cache[$feedid] = $datatype; // Cache it
        }
        $now = time();
        if ($datatype==2) { //daily
            $start=$this->process->getstartday($now); // start of day
            $endslot = $start + 86400; // one day range
            $opt_timearray = array('start' => $start, 'end' => $endslot, 'interval' => 86400);
            $dataValue = $this->process->input($start, null, $processList, $opt_timearray); // execute processlist 
        } else {
            $dataValue = $this->process->input($now, null, $processList); // execute processlist 
        }
        return array('time'=>$now, 'value'=>$dataValue);
    }

    // 1 - Calculates date slots for given start, end and interval. Representing about a pixel on the x axis of the graph for each time slot.
    // 2 - If feed is realtime slots are calculated based on interval, if daily, slots date is at its datetime midnight of user timezone.
    // 3 - Executes virtual feed processlist for each slot individually.
    // 4-  First processor of virtual feed processlist should be the source_feed_data_time() this will get data from a slot.
    // 5 - Agreggates all slots time and processed data.
    // 6 - Returns data to the graph.
    public function get_data($feedid,$start,$end,$interval,$skipmissing,$limitinterval)
    {
        $feedid = intval($feedid);
        $processList = $this->feed->get_processlist($feedid);
        if ($processList == '' || $processList == null) { return false; }
        $start = round($start/1000);
        $end = round($end/1000);
        $interval = intval($interval); // time gap in seconds
                
        if ($interval<1) $interval = 1;
        $dp = ceil(($end - $start) / $interval); // datapoints for desied range with set interval time gap
        $end = $start + ($dp * $interval);
        if ($dp<1) return false;

        // Check if datatype is daily so that select over range is used rather than skip select approach
        static $feed_datatype_cache = array(); // Array to hold the cache
        if (isset($feed_datatype_cache[$feedid])) {
            $datatype = $feed_datatype_cache[$feedid]; // Retrieve from static cache
        } else {
            $result = $this->mysqli->query("SELECT datatype FROM feeds WHERE `id` = '$feedid'");
            $row = $result->fetch_array();
            $datatype = $row['datatype'];
            $feed_datatype_cache[$feedid] = $datatype; // Cache it
        }
        if ($datatype==2) $dp = 0; // daily

        $this->log->info("get_data() feedid=$feedid start=$start end=$end int=$interval sk=$skipmissing li=$limitinterval");

        $data = array();
        $dataValue = null;
        if ($dp > 0) 
        {
            $range = $end - $start; // windows duration in seconds
            $td = $range / $dp;    // time duration for each datapoint
            $t = $start; $tb = 0;  // time between t and tb
            for ($i=0; $i<$dp; $i++)
            {
                $tb = $start + intval(($i+1)*$td); //next end time
                $opt_timearray = array('start' => $t, 'end' => $tb, 'interval' => $interval);
                $dataValue = $this->process->input($t, $dataValue, $processList, $opt_timearray); // execute processlist 
                    
                if ($dataValue!=NULL || $skipmissing===0) { // Remove this to show white space gaps in graph
                    $time = $t * 1000;
                    $data[] = array($time, (float)$dataValue);
                }
                $t = $tb; // next start time
            }
        }
        else {
            //daily virtual feed
             $startslot=$this->process->getstartday($start); // start of day for user timezone
             $endslot=$this->process->getstartday($end); // end of day for user timezone
            
             if ($endslot < $startslot) $endslot = $endslot + 86400; // one day range
             while ($startslot<$endslot)
             {
                $opt_timearray = array('start' => $startslot, 'end' => $startslot+86400, 'interval' => $interval);
                $dataValue = $this->process->input($startslot, $dataValue, $processList, $opt_timearray); // execute processlist 
                    
                if ($dataValue!=NULL || $skipmissing===0) { // Remove this to show white space gaps in graph
                    $time = $startslot * 1000;
                    $data[] = array($time, (float)$dataValue);
                }
                $startslot +=86400; // inc a day
             }
        }

        return $data;
    }


    public function export($feedid,$start)
    {
        return false; // TBD
    }

    public function csv_export($feedid,$start,$end,$outinterval)
    {
        return false; // TBD
    }

}
