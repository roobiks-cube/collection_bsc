<?php


$post_data = $_POST['myText'] . $_POST['timer2'] . $_POST['myText2'] . $_POST['myText3']. $_POST['myText4'];

	$filename = $_POST['person'].".txt";
    $handle = fopen($filename, "a+");      

   
	fwrite($handle, $_POST['myText']."\r\n");
	fwrite($handle, $_POST['timer2']."\r\n");
	fwrite($handle, $_POST['myText2']."\r\n");
	fwrite($handle, $_POST['myText3']."\r\n");
	fwrite($handle, $_POST['myText4']."\r\n");
	
     fclose($handle);
?>