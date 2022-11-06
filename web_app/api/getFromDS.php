<?php

  $key = $_GET["key"];


  $json = (array)json_decode(file_get_contents("../export.json"), true);

  echo json_encode($json[$key]);

?>