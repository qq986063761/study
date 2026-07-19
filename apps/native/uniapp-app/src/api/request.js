const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://jsonplaceholder.typicode.com";

export function request({ url, method = "GET", data, header = {} }) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${API_BASE_URL}${url}`,
			method,
			data,
			header: {
				Accept: "application/json",
				...header,
			},
			timeout: 10000,
			success(response) {
				if (response.statusCode >= 200 && response.statusCode < 300) {
					resolve(response.data);
					return;
				}

				const error = new Error(`请求失败（HTTP ${response.statusCode}）`);
				error.statusCode = response.statusCode;
				error.data = response.data;
				reject(error);
			},
			fail(error) {
				reject(new Error(error.errMsg || "网络请求失败"));
			},
		});
	});
}
