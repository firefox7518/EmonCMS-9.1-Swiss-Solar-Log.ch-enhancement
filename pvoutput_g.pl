# 
# This script has been created by Andreas Messerli - Swiss-Solar-Log.ch to fulfil the need to have solar generation 
# and house consumption also logged in pvoutput.org.
# 
# To do this EmonCMS has been enhanced to allow 2 feeds to be sent to pvoutput.org -> Generation = v2 and Consumption = v4
# The users db has been enhanced to hold the pvoutput API and System ID as well as the both feed ID's necessary to send the data
# Use Cron or Windows task scheduler to trigger this script every 1-5mins depending on your needs and subscription level
# The log file will be created from where the script will be started (Path). In Windows Task Scheduler you need to set the 
# working directory. Otherwise the log file will be created in the perl path ;-)
# The script is still under development to maybe also incorporate more information like Temp and weather condition etc.
# Feel free to change the script as you need but please let me know if you have made enhancements which are worth sharing for
# everyone! Send mail to firefox7518@gmail.com
#

use LWP::Simple;
use DBI;
use DateTime;

$dbh = DBI->connect('DBI:mysql:dbname;host=localhost', 'dbuser', 'dbpassword'
	           ) || die "Could not connect to database: $DBI::errstr";
$dbh -> {mysql_auto_reconnect} = 1;

# Open Log file from the beginning
my $filedate = substr( get_date(), 0,10);
open WRITEFILE, ">>", $filedate. "_pvoutput_generation_log_emonuser.txt" or die $!; # define outputfile

# Target Reporting Host URL
my $host = "pvoutput.org";

my $userdb = $dbh->selectall_hashref('SELECT * FROM users where pvoutputapikey is not null', 'generationfeed');
		
foreach my $id (keys %$userdb){
		
	my $feedid1 = $userdb->{$id}->{generationfeed};
	my $feedid2 = $userdb->{$id}->{consumptionfeed};
	my $owner = $userdb->{$id}->{name};
	my $timezone = $userdb->{$id}->{timezone};
	my $pvoutputsid = $userdb->{$id}->{pvoutputsid};
	my $pvoutputapikey = $userdb->{$id}->{pvoutputapikey};
	
	logit (" ---------------------------------------------------- ");
	logit (" EmonCMS Owner name = $owner ");
	logit (" EmonCMS Feed ID = $feedid ");
	logit (" EmonCMS User timezone = $timezone ");
	logit (" PVOutput SID = $pvoutputsid ");
	logit (" PVOutput API Key = $pvoutputapikey ");
			
	my $smt = 'SELECT id, value FROM feeds';
	my $feed_data = $dbh->selectall_hashref($smt, 'id');
	my $feed_value1 = $feed_data->{$feedid1}->{value};
	my $feed_value2 = $feed_data->{$feedid2}->{value};
	my $time = DateTime->now( time_zone => 'UTC' );
	$time->set_time_zone( $timezone );
	my $time_now = localtime();
#	my $date1 = $time->strftime('%Y%m%d');
#	my $time1 = $time->strftime('%H:%M');
	my $pvoutput_date = $time->ymd('');
	my $pvoutput_time = substr($time->hms,0,5);

#	Create the PVOutput URL with the gathered data	
	my $url = "http://$host/service/r2/addstatus.jsp?key=$pvoutputapikey&sid=$pvoutputsid&d=$pvoutput_date&t=$pvoutput_time&v2=$feed_value1&v4=$feed_value2"; 
#	my $content = get $url or logit ( "Unable to get $url");	
	logit (" PVoutput URL = $url ");
	logit (" $content ");

}

close WRITEFILE;

# date calculation for logging and other functionality
sub get_date{
	my($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst)=localtime();
	return sprintf ("%04d-%02d-%02d %02d:%02d:%02d",$year+1900,$mon+1,$mday,$hour,$min,$sec);
}

# logging
sub logit {
	my $text = shift;
	my $date = get_date();
	print WRITEFILE "[$date] $text \n";
}