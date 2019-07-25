<?
if (empty($_GET['token']) && $_GET['token'] != '12345') {
	echo "access denied";
	exit();
}

require_once 'include/connection.php';


$sth = $DB->query('SELECT id FROM sensors');
$sensors = $sth->fetchAll(PDO::FETCH_COLUMN);



$DB->beginTransaction();

$sth = $DB->prepare('INSERT INTO stamps (sensor_id, value) VALUES (?, ?)');

foreach ($_GET as $id => $value)
	if (in_array($id, $sensors))
		$sth->execute([$id, $value]);
	
echo $DB->commit() ? "OK" : "FAIL";

?>