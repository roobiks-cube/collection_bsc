<?php


$post_data = $_POST['myText'] . $_POST['endtimer'] . $_POST['myText2'] . $_POST['myText3'];

	$filename = $_POST['person'].".txt";
    $handle = fopen($filename, "a+");      

   
	fwrite($handle, $_POST['myText']."\r\n");
	fwrite($handle, $_POST['endtimer']."\r\n");	
	fwrite($handle, $_POST['myText2']."\r\n");
	fwrite($handle, $_POST['myText3']."\r\n");
	
     fclose($handle);
?>