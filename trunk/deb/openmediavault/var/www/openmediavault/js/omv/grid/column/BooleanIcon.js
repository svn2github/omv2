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
 * @class OMV.grid.column.BooleanIcon
 * @derived Ext.grid.column.Column
 */
Ext.define("OMV.grid.column.BooleanIcon", {
	extend: "Ext.grid.column.Column",
	alias: [ "widget.booleaniconcolumn" ],
	uses: [
		"OMV.util.Format"
	],

	trueIcon: Ext.supports.Svg ? "yes.svg" : "yes.png",
	falseIcon: Ext.supports.Svg ? "no.svg" : "no.png",
	undefinedText: "&#160;",
	trueValue: [ true, 1, "true", "ok", "1", "y", "yes", "on" ],

	align: "center",

	defaultRenderer: function(value, metaData) {
		var me = this;
		if (!Ext.isDefined(value))
			return me.undefinedText;
		var img = me.falseIcon;
		if (Ext.Array.contains(me.trueValue, value))
			img = me.trueIcon;
		return Ext.String.format("<img border='0' src='images/{0}' " +
		  "alt='{1}'>", img, OMV.util.Format.boolean(value));
	},

	updater: function(cell, value, record, view, dataSource) {
        cell.firstChild.innerHTML = this.defaultRenderer(value, null);
    }
});
