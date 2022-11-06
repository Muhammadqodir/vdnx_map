<?php

echo "running";
$command = exec('python3 ../test.py');
echo "<br>";
print_r($command);


?>