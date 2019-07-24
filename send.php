<pre><?
if (empty($_GET['token']) && $_GET['token'] != '12345')
	echo "access denied";

require_once 'include/connection.php';


$sth = $DB->query('SELECT id FROM sensors');
$sensors = $sth->fetchAll(PDO::FETCH_COLUMN);



$DB->beginTransaction();

$sth = $DB->prepare('INSERT INTO stamps (sensor_id, value) VALUES (?, ?)');

foreach ($_GET as $id => $value)
	if (in_array($id, $sensors))
		$sth->execute([$id, $value]);
	
echo $DB->commit() ? "success" : "fail";


$sth = $DB->query('SELECT * FROM stamps ORDER BY id DESC');
$stamps = $sth->fetchAll(PDO::FETCH_ASSOC);
print_r($stamps);
?></pre>