/**
 * This file is part of OpenMediaVault.
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @copyright Copyright (c) 2009-2016 Volker Theile
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
// require("js/omv/form/field/Password.js")

/**
 * @class OMV.module.admin.system.network.Proxy
 * @derived OMV.workspace.form.Panel
 */
Ext.define("OMV.module.admin.system.network.Proxy", {
	extend: "OMV.workspace.form.Panel",
	requires: [
		"OMV.form.field.Password",
	],

	rpcService: "Network",
	rpcGetMethod: "getProxy",
	rpcSetMethod: "setProxy",

	getFormItems: function() {
		return [{
			xtype: "fieldset",
			title: _("HTTP-Proxy"),
			fieldDefaults: {
				labelSeparator: ""
			},
			items: [{
				xtype: "textfield",
				fieldLabel: _("Host"),
				name: "httphost",
				vytpe: "domainnameIP",
				allowBlank: true
			},{
				xtype: "numberfield",
				name: "httpport",
				fieldLabel: _("Port"),
				vtype: "port",
				minValue: 1,
				maxValue: 65535,
				allowDecimals: false,
				allowBlank: false,
				value: 8080
			},{
				xtype: "textfield",
				fieldLabel: _("Username"),
				name: "httpusername",
				allowBlank: true
			},{
				xtype: "passwordfield",
				fieldLabel: _("Password"),
				name: "httppassword",
				allowBlank: true
			}]
		},{
			xtype: "fieldset",
			title: _("HTTPS-Proxy"),
			fieldDefaults: {
				labelSeparator: ""
			},
			items: [{
				xtype: "textfield",
				fieldLabel: _("Host"),
				name: "httpshost",
				vytpe: "domainnameIP",
				allowBlank: true
			},{
				xtype: "numberfield",
				name: "httpsport",
				fieldLabel: _("Port"),
				vtype: "port",
				minValue: 1,
				maxValue: 65535,
				allowDecimals: false,
				allowBlank: false,
				value: 8080
			},{
				xtype: "textfield",
				fieldLabel: _("Username"),
				name: "httpsusername",
				allowBlank: true
			},{
				xtype: "passwordfield",
				fieldLabel: _("Password"),
				name: "httpspassword",
				allowBlank: true
			}]
		},{
			xtype: "fieldset",
			title: _("FTP-Proxy"),
			fieldDefaults: {
				labelSeparator: ""
			},
			items: [{
				xtype: "textfield",
				fieldLabel: _("Host"),
				name: "ftphost",
				vytpe: "domainnameIP",
				allowBlank: true
			},{
				xtype: "numberfield",
				name: "ftpport",
				fieldLabel: _("Port"),
				vtype: "port",
				minValue: 1,
				maxValue: 65535,
				allowDecimals: false,
				allowBlank: false,
				value: 8080
			},{
				xtype: "textfield",
				fieldLabel: _("Username"),
				name: "ftpusername",
				allowBlank: true
			},{
				xtype: "passwordfield",
				fieldLabel: _("Password"),
				name: "ftppassword",
				allowBlank: true
			}]
		}];
	}
});

OMV.WorkspaceManager.registerPanel({
	id: "proxy",
	path: "/system/network",
	text: _("Proxy"),
	position: 30,
	className: "OMV.module.admin.system.network.Proxy"
});
