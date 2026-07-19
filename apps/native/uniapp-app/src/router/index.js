import { routes } from "@/router/routes.js";

function withQuery(path, query = {}) {
	const search = Object.entries(query)
		.filter(([, value]) => value !== undefined && value !== null && value !== "")
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
		.join("&");

	return search ? `${path}?${search}` : path;
}

export function navigateTo(path, query) {
	return uni.navigateTo({ url: withQuery(path, query) });
}

export function relaunch(path = routes.home, query) {
	return uni.reLaunch({ url: withQuery(path, query) });
}

export function backOrHome(delta = 1) {
	if (getCurrentPages().length > delta) {
		return uni.navigateBack({ delta });
	}

	return relaunch();
}

export { routes };
