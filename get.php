<?
require_once 'include/connection.php';

if(empty($_GET['sensor_id'])) {
	echo 'null';
	exit();
} 

$sql = "SELECT `time`, `value` FROM stamps";

/* ------ FILTER BY SENSOR ID ---------- */

$request_arr[] = "sensor_id = :sensor_id";
$execute_arr["sensor_id"] = $_GET['sensor_id'];



/* ------ TIME FILTERS ---------- */

$time_filters = [
	['from_time', 	 	'>=',	'%H:%i:%s'],
	['to_time', 	 	'<=',	'%H:%i:%s'],
	['from_date', 	 	'>=',	'%Y-%m-%d'],
	['to_date', 	 	'<=',	'%Y-%m-%d'],
	['from_datetime',	'>',	'%Y-%m-%d_%H:%i:%s'],
	['to_datetime',  	'<=',	'%Y-%m-%d_%H:%i:%s']
];

foreach ($time_filters as $params)
	if(!empty($_GET[$params[0]])) 
	{
		$request_arr[] = "DATE_FORMAT(time, '$params[2]') $params[1] :$params[0]";
		$execute_arr[$params[0]] = $_GET[$params[0]];
	}



/* ------ CONCAT ALL FILTERS TO QUERY ---------- */

$sql.= ' WHERE '.implode(' AND ', $request_arr).' ORDER BY `time`';




$sth = $DB->prepare($sql);
$sth->execute($execute_arr);

$stamps = $sth->fetchAll(PDO::FETCH_NUM);
echo json_encode ($stamps);



