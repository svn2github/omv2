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
// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")
// require("js/omv/workspace/grid/Panel.js")
// require("js/omv/workspace/window/Form.js")
// require("js/omv/workspace/window/plugin/ConfigObject.js")
// require("js/omv/form/field/Grid.js")
// require("js/omv/module/admin/service/iscsitarget/AuthUsers.js")

/**
 * @class OMV.module.admin.service.iscsitarget.Settings
 * @derived OMV.workspace.form.Panel
 */
Ext.define("OMV.module.admin.service.iscsitarget.Settings", {
	extend: "OMV.workspace.form.Panel",
	requires: [
		"OMV.data.Store",
		"OMV.data.Model",
		"OMV.form.field.Grid",
		"OMV.workspace.grid.Panel"
	],
	uses: [
		"OMV.module.admin.service.iscsitarget.AuthUsers"
	],

	rpcService: "iSCSITarget",
 	rpcGetMethod: "getSettings",
	rpcSetMethod: "setSettings",

	getFormItems: function() {
		var me = this;
		return [{
			xtype: "fieldset",
			title: _("General settings"),
			fieldDefaults: {
				labelSeparator: ""
			},
			items: [{
				xtype: "checkbox",
				name: "enable",
				fieldLabel: _("Enable"),
				checked: false
			},{
				xtype: "textfield",
				name: "extraoptions",
				fieldLabel: _("Extra options"),
				allowBlank: true
			}]
		},{
			xtype: "fieldset",
			title: _("Discovery authentication"),
			fieldDefaults: {
				labelSeparator: ""
			},
			items: [{
				xtype: "gridfield",
				name: "authentication",
				fieldLabel: _("Users"),
				height: 150,
/* Use the store which is defined by the grid class.
				store: Ext.create("OMV.data.Store", {
					autoLoad: false,
					model: OMV.data.Model.createImplicit({
						idProperty: "uuid",
						fields: [
							{ name: "uuid", type: "string" },
							{ name: "type", type: "string" },
							{ name: "username", type: "string" },
							{ name: "password", type: "string" }
						]
					}),
					proxy: {
						type: "memory",
						reader: {
							type: "json"
						}
					},
					sorters: [{
						direction: "ASC",
						property: "username"
					}]
				}),
*/
				gridClass: "OMV.module.admin.service.iscsitarget.AuthUsers",
				gridConfig: {
					stateful: true,
					stateId: "54af0f59-ef4e-4c1f-a3c3-1efaa1ea02fd"
				}
			}]
		}];
	}
});

OMV.WorkspaceManager.registerPanel({
	id: "settings",
	path: "/service/iscsitarget",
	text: _("Settings"),
	position: 10,
	className: "OMV.module.admin.service.iscsitarget.Settings"
});
