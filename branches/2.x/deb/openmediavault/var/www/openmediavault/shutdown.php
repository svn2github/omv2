<?php
/**
 * This file is part of OpenMediaVault.
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @copyright Copyright (c) 2009-2015 Volker Theile
 *
 * OpenMediaVault is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * OpenMediaVault is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenMediaVault. If not, see <http://www.gnu.org/licenses/>.
 */
require_once("openmediavault/env.inc");
require_once("openmediavault/product.inc");

$prd = new OMVProduct();
$title = sprintf("%s - %s", $prd->getName(),
  gettext("Web administration interface"));
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?=$title;?></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="shortcut icon" type="image/x-icon" href="favicon.ico"/>
		<link rel="stylesheet" type="text/css" href="css/omv.css"/>
	</head>
	<body class="shutdown-page">
		<a href='/'><div class="shutdown-icon"></div></a>
		<a title='<?=$prd->getName();?>' href='<?=$prd->getURL();?>' target='_blank'><div class="product-logo"></div></a>
	</body>
</html>
