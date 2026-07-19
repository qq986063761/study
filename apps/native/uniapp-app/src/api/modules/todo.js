import { request } from "@/api/request.js";

export function getTodo(id) {
	return request({
		url: `/todos/${id}`,
	});
}
