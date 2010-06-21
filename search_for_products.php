<?php

// Dependencies
require_once 'cloudfusion/cloudfusion.class.php';

// Instantiate
$util = new CFUtilities();
$pas = new AmazonPAS();
$my_custom_search = $pas->item_search("amazon", array('ResponseGroup' => 'Large'));

echo ($util->json_encode($my_custom_search));

?>