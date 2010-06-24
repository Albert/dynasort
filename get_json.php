<?php
require_once 'cloudfusion/cloudfusion.class.php';
$pas = new AmazonPAS();
$util = new CFUtilities();

$itemsArray = array();

for ($counter = 1; $counter < 6; $counter++) {
  $response = $pas->item_search("electric fan", array("ResponseGroup" => "Large", ItemPage => $counter));
  foreach($response->body->Items->Item as $item) {
    $itemArray = array(
      "detailPage" => $item -> DetailPageURL,
      "title" => $item -> ItemAttributes -> Title,
      "imgURL" => $item -> ImageSets -> ImageSet -> SwatchImage -> URL,
      "totalReviews" => $item -> CustomerReviews -> TotalReviews,
      "averageRating" => $item -> CustomerReviews -> AverageRating,
      "salesRank" => $item -> SalesRank,
      "price" => $item -> ItemAttributes -> ListPrice -> Amount,
      "formattedPrice" => $item -> ItemAttributes -> ListPrice -> FormattedPrice
    );
    array_push($itemsArray, $itemArray);
  }
}
echo json_encode($itemsArray);
?>