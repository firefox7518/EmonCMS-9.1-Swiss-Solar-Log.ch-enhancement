/* Changes done to schema to add multiple fields for PVoutput reporting of generation and a consumption feed and 
to store Enecsys 1st and 2nd Gen Solar gateway serial numbers.
Added by Andreas Messerli - Swiss-Solar-log.ch - firefox7518@gmail.com */

<?php

$schema['users'] = array(
    'id' => array('type' => 'int(11)', 'Null'=>'NO', 'Key'=>'PRI', 'Extra'=>'auto_increment'),
    'username' => array('type' => 'varchar(30)'),
    'email' => array('type' => 'varchar(30)'),
    'password' => array('type' => 'varchar(64)'),
    'salt' => array('type' => 'varchar(32)'),
    'apikey_write' => array('type' => 'varchar(64)'),
    'apikey_read' => array('type' => 'varchar(64)'),
    'lastlogin' => array('type' => 'datetime'),
    'admin' => array('type' => 'int(11)', 'Null'=>'NO'),
	'pvoutputapikey' => array('type' => 'varchar(64)'),
	'pvoutputsid' => array('type' => 'varchar(30)'),
	'consumptionfeed' => array('type' => 'varchar(30)'),
	'generationfeed' => array('type' => 'varchar(30)'),
	'enecsysgw1' => array('type' => 'varchar(64)'),
	'enecsysgw2' => array('type' => 'varchar(64)'),

    // User profile fields
    'gravatar' => array('type' => 'varchar(30)', 'default'=>''),
    'name'=>array('type'=>'varchar(30)', 'default'=>''),
    'location'=>array('type'=>'varchar(30)', 'default'=>''),
    'timezone' => array('type'=>'varchar(64)', 'default'=>'UTC'),
    'language' => array('type' => 'varchar(5)', 'default'=>'en_EN'),
    'bio' => array('type' => 'text', 'default'=>''),
	'pvoutputapikey'=>array('type'=>'varchar(64)', 'default'=>''),
	'pvoutputsid'=>array('type'=>'varchar(30)', 'default'=>''),
	'generationfeed'=>array('type'=>'varchar(30)', 'default'=>''),
	'consumptionfeed'=>array('type'=>'varchar(30)', 'default'=>''),
	'enecsysgw1'=>array('type'=>'varchar(64)', 'default'=>''),
	'enecsysgw2'=>array('type'=>'varchar(64)', 'default'=>''),
);

$schema['rememberme'] = array(
    'userid' => array('type' => 'int(11)'),
    'token' => array('type' => 'varchar(40)'),
    'expire' => array('type' => 'datetime')
);
