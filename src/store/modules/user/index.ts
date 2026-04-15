import { defineStore } from 'pinia';
// import {userLogin} from '@/api/login.ts';
// import {adminUserInfo} from '@/api/adminUser.ts';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';
import { Notification } from '@arco-design/web-vue';
const useUserStore = defineStore('user', {
	state: (): UserState => ({
		deptId: undefined,
		deptName: undefined,
		isFirstLogin: undefined,
		majorIds: undefined,
		majorNames: undefined,
		mobile: undefined,
		nickname: undefined,
		organizationTree: undefined,
		roleId: undefined,
		roleName: undefined,
		sex: undefined,
		phone: undefined,
		userId: undefined,
		accountId: undefined,
		username: undefined,
		role: undefined,
		studentId: undefined,
		headPortraitUrl: undefined,
		studentName: undefined,
		organizationName: undefined,
		studentNo: undefined,


	}),

	getters: {
		userInfo(state: UserState): UserState {
			return { ...state
			};
		},
	},

	actions: {
		switchRoles() {
			return new Promise((resolve) => {
				this.role = this.role === 'user' ? 'admin' : 'user';
				resolve(this.role);
			});
		},
		// Set user's information
		setInfo(partial: Partial < UserState > ) {
			this.$patch(partial);
		},

		// Reset user's information
		resetInfo() {
			this.$reset();
		},

		// Get user's information
		async info() {
			// 虚假获取用户信息
			const res = await adminUserInfo();
			// if (res.code == '403') {
			// 	Notification.warning(res.message)
			// 	this.resetInfo();
			// 	clearToken();
			// 	removeRouteListener();

			// 	return
	
			// } 
			var data = Object.assign({}, res.data, {
				role: res.data.authorities,
			})
			this.setInfo(data);
			
		},

		// Login
		async login(loginForm) {
			setToken('虚假token');
			try {	
			
				//  const res = await userLogin(loginForm);
			
				// if(res.code == "200"){
				// 	setToken(res.data);
				// } else {
					
				// 	 throw err;
				// }
					setToken('虚假token');
			} catch (err) {
				
				 clearToken();
				throw err;
			}
		},
		logoutCallBack() {
			const appStore = useAppStore();
			this.resetInfo();
			clearToken();
			removeRouteListener();
			appStore.clearServerMenu();
		},
		// Logout
		async logout() {
			this.logoutCallBack();
		},
	},
});

export default useUserStore;