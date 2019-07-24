<pre><?

require_once 'connection.php';

$res = $DB->query("
	CREATE TABLE IF NOT EXISTS sensors (
	    `id` INT,
	    `name` VARCHAR(255) NOT NULL,
	    `unit` VARCHAR(255) NOT NULL,
	    PRIMARY KEY (id)
	)
");

if ($res !== FALSE) echo "таблица <u>sensors</u> успешно создана, либо уже существует\n";


$res = $DB->query("
	CREATE TABLE IF NOT EXISTS stamps (
	    `id` INT AUTO_INCREMENT,
	    `time` DATETIME default CURRENT_TIMESTAMP,
	    `sensor_id` INT NOT NULL,
	    `value` FLOAT NOT NULL,    
	    PRIMARY KEY (id),
	    FOREIGN KEY (sensor_id) REFERENCES sensors (id) ON DELETE CASCADE
	)
");
if ($res !== FALSE) echo "\nтаблица <u>stamps</u> успешно создана, либо уже существует";

?></pre>