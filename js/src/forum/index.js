import { extend, override } from 'flarum/common/extend';
import app from 'flarum/common/app';

import HeaderSecondary from "flarum/components/HeaderSecondary";
import SettingsPage from "flarum/components/SettingsPage";
import Button from 'flarum/components/Button';

import LogInModal from "flarum/components/LogInModal";
import LDAPLogInModal from "./components/LDAPLogInModal";

const translationPrefix = 'tituspijean-auth-ldap.forum.';

app.initializers.add('tituspijean-auth-ldap', () => {

	extend(HeaderSecondary.prototype, 'items', addLoginLink);
	extend(HeaderSecondary.prototype, 'items', removeIfOnlyUse);
	extend(LogInModal.prototype, 'content', overrideModal);

	extend(SettingsPage.prototype, 'accountItems', removeProfileActions);
	extend(SettingsPage.prototype, 'settingsItems', checkRemoveAccountSection);

	function overrideModal() {
		if (app.forum.attribute('tituspijean-auth-ldap.onlyUse')) {
			LogInModal.prototype.content = LDAPLogInModal.prototype.content
			LogInModal.prototype.title = LDAPLogInModal.prototype.title
			LogInModal.prototype.body = LDAPLogInModal.prototype.body
			LogInModal.prototype.fields = LDAPLogInModal.prototype.fields
			LogInModal.prototype.footer = LDAPLogInModal.prototype.footer
			LogInModal.prototype.onsubmit = LDAPLogInModal.prototype.onsubmit
		}
	}

	function addLoginLink(items) {
		if (items.has('logIn')) {
			items.add('logInLDAP',
				Button.component(
				  {
            className: 'Button Button--link',
            onclick: () => app.modal.show(LDAPLogInModal)
				  },
          app.translator.trans(translationPrefix + 'log_in_with', {server: app.forum.attribute('tituspijean-auth-ldap.method_name')})
				),
        0
			);
		}
	}

	function removeIfOnlyUse(items) {
		if (app.forum.attribute('tituspijean-auth-ldap.onlyUse')) {
			if (items.has('signUp')) {
				items.remove('signUp');
			}
			if (items.has('logIn')) {
				items.remove('logIn');
			}
		}
	}

	function removeProfileActions(items) {
		items.remove('changeEmail');
		items.remove('changePassword');
	}

	function checkRemoveAccountSection(items) {
		if (items.has('account') &&
			items.get('account').children.length === 0) {
			items.remove('account');
		}
	}
});
