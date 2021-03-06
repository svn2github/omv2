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
// require("js/omv/util/Format.js")

/**
 * @ingroup webgui
 * @class OMV.grid.column.Empty
 * @derived Ext.grid.column.Column
 * @param emptyText The text to be used if the value to be displayed is
 *   empty. Defaults to 'n/a'.
 */
Ext.define("OMV.grid.column.Empty", {
	extend: "Ext.grid.column.Column",
	alias: [ "widget.emptycolumn" ],

	emptyText: _("n/a"),

	defaultRenderer: function(value) {
		return Ext.util.Format.defaultValue(value, this.emptyText);
	}
});
