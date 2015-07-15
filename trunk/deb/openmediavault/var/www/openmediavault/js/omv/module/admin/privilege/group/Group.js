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
// require("js/omv/workspace/grid/Panel.js")
// require("js/omv/workspace/window/Form.js")
// require("js/omv/workspace/window/Grid.js")
// require("js/omv/workspace/window/TextArea.js")
// require("js/omv/form/field/CheckboxGrid.js")
// require("js/omv/grid/PrivilegesByRole.js")
// require("js/omv/util/Format.js")
// require("js/omv/Rpc.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")

/**
 * @class OMV.module.admin.privilege.group.Group
 * @derived OMV.workspace.window.Form
 */
Ext.define("OMV.module.admin.privilege.group.Group", {
	extend: "OMV.workspace.window.Form",
	uses: [
		"OMV.data.Store",
		"OMV.data.Model",
		"OMV.data.proxy.Rpc",
		"OMV.form.field.CheckboxGrid"
	],

	rpcService: "UserMgmt",
	rpcSetMethod: "setGroup",
	height: 305,

	getFormConfig: function() {
		return {
			layout: {
				type: "vbox",
				align: "stretch"
			}
		};
	},

	getFormItems: function() {
		var me = this;
		return [{
			xtype: "textfield",
			name: "name",
			fieldLabel: _("Name"),
			allowBlank: false,
			vtype: "groupname",
			readOnly: Ext.isDefined(me.rpcGetMethod)
		},{
			xtype: "textarea",
			name: "comment",
			fieldLabel: _("Comment"),
			allowBlank: true,
			vtype: "comment"
		},{
			xtype: "checkboxgridfield",
			name: "members",
			fieldLabel: _("Members"),
			valueField: "name",
			flex: 1,
			store: Ext.create("OMV.data.Store", {
				autoLoad: true,
				groupField: "system",
				model: OMV.data.Model.createImplicit({
					idProperty: "name",
					fields: [
						{ name: "name", type: "string" },
						{ name: "system", type: "boolean" }
					]
				}),
				proxy: {
					type: "rpc",
					appendSortParams: false,
					rpcData: {
						service: "UserMgmt",
						method: "enumerateAllUsers"
					}
				},
				sorters: [{
					direction: "ASC",
					property: "name"
				}]
			}),
			gridConfig: {
				stateful: true,
				stateId: "e03fffb6-b1ed-11e2-b01b-00221568ca88",
				features: [{
					ftype: "grouping",
					groupHeaderTpl: Ext.create("Ext.XTemplate",
						"{[this.renderValue(values)]}", {
						renderValue: function(values) {
							var result;
							switch (values.groupField) {
							case "system":
								result = values.groupValue ?
								  _("System accounts") :
								  _("User accounts");
								break;
							default:
								result = Ext.String.format("{0}: {1}",
								  values.columnName, values.name);
								break;
							}
							return result;
						}
					})
				}],
				columns: [{
					text: _("Name"),
					sortable: true,
					dataIndex: "name",
					stateId: "name",
					flex: 1
				},{
					xtype: "booleantextcolumn",
					text: _("System"),
					sortable: true,
					dataIndex: "system",
					stateId: "system",
					align: "center",
					hidden: true,
					flex: 1
				}]
			},
			value: []
		}];
	}
});

/**
 * @class OMV.module.admin.privilege.group.Import
 * @derived OMV.workspace.window.TextArea
 */
Ext.define("OMV.module.admin.privilege.group.Import", {
	extend: "OMV.workspace.window.TextArea",

	title: _("Import groups"),
	width: 580,
	height: 350,

	rpcService: "UserMgmt",
	rpcSetMethod: "importGroups",
	rpcSetPollStatus: true,
	autoLoadData: false,
	submitMsg: _("Importing groups ..."),
	hideOkButton: false,
	okButtonText: _("Import"),
	readOnly: false,

	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		// Add the tip toolbar at the bottom of the window.
		me.addDocked({
			xtype: "tiptoolbar",
			dock: "bottom",
			ui: "footer",
			text: _("Each line represents one group.")
		});
	},

	getTextAreaConfig: function() {
		return {
			allowBlank: false,
			value: "# <name>;<gid>;<comment>"
		};
	},

	getValues: function() {
		var me = this;
		var values = me.callParent(arguments);
		return {
			csv: values
		};
	},

	setValues: function(values) {
		var me = this;
		return me.setValues(values.cvs);
	}
});

/**
 * @class OMV.module.admin.privilege.group.SharedFolderPrivileges
 * @derived OMV.workspace.window.Grid
 * Display all shared folder privileges from the given group.
 */
Ext.define("OMV.module.admin.privilege.group.SharedFolderPrivileges", {
	extend: "OMV.workspace.window.Grid",
	requires: [
		"OMV.grid.PrivilegesByRole"
	],

	rpcService: "ShareMgmt",
	rpcSetMethod: "setPrivilegesByRole",

	title: _("Shared folder privileges"),
	width: 500,
	height: 300,
	hideResetButton: true,
	gridClassName: "OMV.grid.PrivilegesByRole",

	/**
	 * The class constructor.
	 * @fn constructor
	 * @param roleName The name of the group. Required.
	 */

	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		// Add the tip toolbar at the bottom of the window.
		me.addDocked({
			xtype: "tiptoolbar",
			dock: "bottom",
			ui: "footer",
			text: _("These settings are used by the services to configure the user access rights. Please note that these settings have no effect on file system permissions.")
		});
	},

	getGridConfig: function() {
		var me = this;
		return {
			border: false,
			stateful: true,
			stateId: "970b4908-1192-11e4-aacb-0002b3a176b4",
			roleType: "group",
			roleName: me.roleName
		};
	},

	getRpcSetParams: function() {
		var me = this;
		var privileges = [];
		var items = me.getValues();
		Ext.Array.each(items, function(item) {
			// Set default values.
			var privilege = {
				uuid: item.uuid,
				perms: -1
			};
			if ((true === item.deny) || (true === item.readonly) ||
			  (true === item.writeable)) {
				privilege.perms = 0; // No access
				if (true === item.readonly)
					privilege.perms = 5;
				else if (true === item.writeable)
					privilege.perms = 7;
			}
			Ext.Array.push(privileges, privilege);
		});
		return {
			role: "group",
			name: me.roleName,
			privileges: privileges
		};
	}
});

/**
 * @class OMV.module.admin.privilege.group.Groups
 * @derived OMV.workspace.grid.Panel
 */
Ext.define("OMV.module.admin.privilege.group.Groups", {
	extend: "OMV.workspace.grid.Panel",
	requires: [
		"OMV.Rpc",
		"OMV.data.Store",
		"OMV.data.Model",
		"OMV.data.proxy.Rpc",
		"OMV.util.Format"
	],
	uses: [
		"OMV.module.admin.privilege.group.Group",
		"OMV.module.admin.privilege.group.Import",
		"OMV.module.admin.privilege.group.SharedFolderPrivileges"
	],

	hidePagingToolbar: false,
	stateful: true,
	stateId: "d7c66fd9-2ef5-4107-9a6f-562dcdc2643a",
	columns: [{
		text: _("Name"),
		sortable: true,
		dataIndex: "name",
		stateId: "name"
	},{
		text: _("Comment"),
		sortable: true,
		dataIndex: "comment",
		stateId: "comment"
	},{
		text: _("Members"),
		dataIndex: "members",
		stateId: "members",
		renderer: function(value) {
			if(Ext.isArray(value))
				value = value.join(", ");
			return OMV.util.Format.whitespace(value);
		}
	}],

	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			store: Ext.create("OMV.data.Store", {
				autoLoad: true,
				model: OMV.data.Model.createImplicit({
					idProperty: "name",
					fields: [
						{ name: "name", type: "string" },
						{ name: "comment", type: "string" },
						{ name: "members", type: "object" },
						{ name: "system", type: "boolean" }
					]
				}),
				proxy: {
					type: "rpc",
					rpcData: {
						service: "UserMgmt",
						method: "getGroupList"
					}
				},
				remoteSort: true,
				sorters: [{
					direction: "ASC",
					property: "name"
				}]
			})
		});
		me.callParent(arguments);
	},

	getTopToolbarItems: function() {
		var me = this;
		var items = me.callParent(arguments);
		// Replace the default 'Add' button.
		Ext.Array.erase(items, 0, 1);
		Ext.Array.insert(items, 0, [{
			id: me.getId() + "-add",
			xtype: "splitbutton",
			text: _("Add"),
			icon: "images/add.png",
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			handler: function() {
				this.showMenu();
			},
			menu: Ext.create("Ext.menu.Menu", {
				items: [
					{ text: _("Add"), value: "add" },
					{ text: _("Import"), value: "import" }
				],
				listeners: {
					scope: me,
					click: function(menu, item, e, eOpts) {
						this.onAddButton(item.value);
					}
				}
			})
		}]);
		// Add the 'Privileges' button.
		Ext.Array.insert(items, 2, [{
			id: me.getId() + "-privileges",
			xtype: "button",
			text: _("Privileges"),
			icon: "images/share.png",
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			handler: me.onPrivilegesButton,
			scope: me,
			disabled: true,
			selectionConfig: {
				minSelections: 1,
				maxSelections: 1
			}
		}]);
		return items;
	},

	onAddButton: function(action) {
		var me = this;
		switch(action) {
		case "add":
			Ext.create("OMV.module.admin.privilege.group.Group", {
				title: _("Add group"),
				listeners: {
					scope: me,
					submit: function() {
						this.doReload();
					}
				}
			}).show();
			break;
		case "import":
			Ext.create("OMV.module.admin.privilege.group.Import", {
				listeners: {
					scope: me,
					submit: function() {
						this.doReload();
					}
				}
			}).show();
			break;
		}
	},

	onEditButton: function() {
		var me = this;
		var record = me.getSelected();
		Ext.create("OMV.module.admin.privilege.group.Group", {
			title: _("Edit group"),
			rpcGetMethod: "getGroup",
			rpcGetParams: {
				name: record.get("name")
			},
			listeners: {
				scope: me,
				submit: function() {
					this.doReload();
				}
			}
		}).show();
	},

	onPrivilegesButton: function() {
		var me = this;
		var record = me.getSelected();
		Ext.create("OMV.module.admin.privilege.group.SharedFolderPrivileges", {
			roleName: record.get("name")
		}).show();
	},

	doDeletion: function(record) {
		var me = this;
		OMV.Rpc.request({
			scope: me,
			callback: me.onDeletion,
			rpcData: {
				service: "UserMgmt",
				method: "deleteGroup",
				params: {
					name: record.get("name")
				}
			}
		});
	}
});

OMV.WorkspaceManager.registerNode({
	id: "group",
	path: "/privilege",
	text: _("Group"),
	icon16: "images/group.png",
	iconSvg: "images/group.svg",
	position: 20
});

OMV.WorkspaceManager.registerPanel({
	id: "groups",
	path: "/privilege/group",
	text: _("Group"),
	position: 10,
	className: "OMV.module.admin.privilege.group.Groups"
});
