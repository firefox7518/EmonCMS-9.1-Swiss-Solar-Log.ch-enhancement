use LWP::Simple;
use DBI;
use DateTime;

$dbh = DBI->connect('DBI:mysql:emoncms;host=localhost:3307', 'emoncms', 'phantom'
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