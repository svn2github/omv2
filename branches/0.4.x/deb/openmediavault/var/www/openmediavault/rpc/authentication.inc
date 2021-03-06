<?php
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
require_once("openmediavault/object.inc");
require_once("openmediavault/session.inc");
require_once("openmediavault/system.inc");
require_once("openmediavault/rpc.inc");

class AuthenticationRpc extends OMVRpc {
	public function __construct() {
		$this->methodSchemata = array(
			"login" => array('{
				"type":"object",
				"properties":{
					"username":{"type":"string"},
					"password":{"type":"string"}
				}
			}')
		);
	}

	/**
	 * Login user.
	 * @param data An array containing the following fields:
	 *   \em username The name of the user.
	 *   \em password The password.
	 * @return An array containing the fields \em authenticated which is TRUE
	 *   if authentication was successful, otherwise FALSE. The name of the
	 *   user is in \em username.
	 */
	function login($data) {
//		$this->debug(var_export(func_get_args(), TRUE));
		global $xmlConfig;
		// Validate method parameters
		$this->validateParams(__METHOD__, func_get_args());
		// Get shadow password suite configuration.
		if(FALSE === ($loginDefs = OMVSystem::getLoginDefs())) {
			throw new OMVException(OMVErrorMsg::E_MISC_FAILURE,
			  gettext("Failed to get shadow password suite configuration."));
		}
		// Authenticate the user.
		$authenticated = FALSE;
		$user = new OMVSystemUser($data['username']);
		if($user->exists()) {
			if(FALSE === ($authenticated = pam_auth($data['username'],
			  $data['password'])))
				goto finish;
			if("admin" === $data['username'])
				goto checksession;
			if(TRUE === $user->getInactive()) {
				$authenticated = FALSE;
				goto finish;
			}
			if(!(($user->getUid() >= $loginDefs['UID_MIN']) &&
			  ($user->getUid() <= $loginDefs['UID_MAX']))) {
				$authenticated = FALSE;
				goto finish;
			}
checksession:
			$session = &OMVSession::getInstance();
			if($session->isAuthenticated()) {
				// Is the current session registered to the user to be
				// authenticated?
				if($session->getUsername() !== $data['username']) {
					throw new OMVException(
					  OMVErrorMsg::E_SESSION_ALREADY_AUTHENTICATED);
				}
			} else {
				// Initialize session.
				$role = ($data['username'] === "admin") ?
				  OMV_ROLE_ADMINISTRATOR : OMV_ROLE_USER;
				$session->initialize($data['username'], $role);
			}
			$authenticated = $session->isAuthenticated();
		}
finish:
		if(FALSE === $authenticated) {
			syslog(LOG_ALERT, sprintf("Unauthorized login attempt from %s ".
			  "[username='%s', user-agent=%s]", $_SERVER['REMOTE_ADDR'],
			  $data['username'], $_SERVER['HTTP_USER_AGENT']));
		}
		return array(
			"authenticated" => $authenticated,
			"username" => $data['username']
		);
	}

	/**
	 * Logout user.
	 */
	function logout() {
//		$this->debug(var_export(func_get_args(), TRUE));
		// Check permissions
		$this->validateSession();
		$session = &OMVSession::getInstance();
		$session->destroy();
	}
}
?>
