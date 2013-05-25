/**
 * This file is part of OpenMediaVault.
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @copyright Copyright (c) 2009-2013 Volker Theile
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
// require("js/omv/Rpc.js")
// require("js/omv/window/Execute.js")

/**
 * @ingroup webgui
 * @class OMV.button.CfgApply
 * @derived Ext.button.Button
 * A button that is enabled when configuration changes have been done, thus
 * they can be applied. During the configuration changes are applied a
 * progress dialog will be displayed. The button is disabled if no
 * outstanding configuration changes are available.
 * @param reloadInterval The frequency in milliseconds in which it is
 *   checked whether there are any outstanding configuration changes that
 *   can be applied. Defaults to 5 seconds.
 */
Ext.define("OMV.button.CfgApply", {
	extend: "Ext.button.Button",
	alias: "widget.cfgapplybutton",
	requires: [
		"OMV.Rpc",
		"OMV.window.Execute"
	],

	reloadInterval: 5000,

	constructor: function(config) {
		config = Ext.apply({
			icon: "images/led_gray.png",
			tooltip: _("Apply configuration"),
			disabled: true
		}, config || {});
		this.callParent([config]);
	},

	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		me.on("click", me.onClickHdl, me);
		me.on("render", function(c) {
			if(Ext.isEmpty(me.reloadTask)) {
				me.reloadTask = Ext.util.TaskManager.start({
					run: me.doCheck,
					scope: me,
					interval: me.reloadInterval,
					fireOnStart: true
				});
			}
		}, me);
		me.on("beforedestroy", function(c) {
			if(!Ext.isEmpty(me.reloadTask)) {
				Ext.util.TaskManager.stop(me.reloadTask);
				delete me.reloadTask;
			}
		}, me);
	},

	/**
	 * @method setDisabled
	 */
	setDisabled: function(disabled){
		var me = this;
		// Only change the icon if necessary.
		if(me.disabled !== disabled) {
			me.setIcon(disabled ? "images/led_gray.png" :
			  "images/led_green.png");
		}
		me.callParent(arguments);
	},

	/**
	 * @method doCheck
	 * Private function that checks whether the configuration is marked
	 * dirty. If the configuration is dirty, then the button is enabled,
	 * otherwise it is disabled.
	 */
	doCheck: function() {
		var me = this;
		// Exit immediatelly if configuration is applied at the moment.
		if(Ext.isDefined(me.inProgress) && (true === me.inProgress))
			return;
		// Execute RPC in background, this means errors will be ignored and
		// not forwarded to the caller.
		OMV.Rpc.request({
			  scope: me,
			  callback: function(id, success, response) {
				  me.setDisabled(!response);
			  },
			  rpcData: {
				  service: "Config",
				  method: "isDirty",
				  options: {
					  updatelastaccess: false
				  }
			  },
			  relayErrors: false,
			  showErrors: false
		  });
	},

	/**
	 * @method onClickHdl
	 * Private function that is called when the button is clicked. During
	 * the outstanding configuration changes are applied a modal progress
	 * dialog is displayed.
	 */
	onClickHdl: function(c, e) {
		OMV.MessageBox.show({
			title: _("Confirmation"),
			msg: _("Do you really want to apply the configuration?"),
			buttons: Ext.Msg.YESNO,
			fn: function(answer) {
				if(answer == "no")
					return;
				// Disable the button during the process.
				this.inProgress = true;
				this.setDisabled(true);
				// Display a progress bar until the configuration changes have
				// been applied.
				var dlg = Ext.create("OMV.window.Execute", {
					title: _("Apply configuration"),
					width: 350,
					rpcService: "Config",
					rpcMethod: "applyChangesBg",
					rpcParams: {
						modules: [],
						force: false
					},
					hideStartButton: true,
					hideStopButton: true,
					hideCloseButton: true,
					progress: true,
					listeners: {
						start: function(c) {
							// Show the progress dialog.
							c.show();
						},
						finish: function(c) {
							var value = c.getValue();
							delete this.inProgress;
							c.close();
							if(value.length > 0) {
								OMV.MessageBox.error(null, value);
							}
						},
						exception: function(c, error) {
							delete this.inProgress;
							c.close();
							OMV.MessageBox.error(null, error);
						},
						scope: this
					}
				});
				dlg.start();
			},
			scope: this,
			icon: Ext.Msg.QUESTION
		});
	}
});
