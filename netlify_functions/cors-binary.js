import fetch from "node-fetch";
export async function handler(event, context) {
	var url = event.path;
	url = url.split(".netlify/functions/cors-binary/")[1];
	url = decodeURIComponent(url);
	url = new URL(url);
	
	for (let i in event.queryStringParameters) {
		url.searchParams.append(i, event.queryStringParameters[i]);
	}
	
	var cookie_string = event.headers.cookie || "";
	var useragent = event.headers["user-agent"] || "";
	
	var header_to_send= {
		"Cookie": cookie_string,
		"User-Agent": useragent,
		"content-type": "application/json",
		"accept": "*/*",
		"host": url.host
	};
	
	var options = {
		method: event.httpMethod.toUpperCase(),
		headers: header_to_send,
		body: event.body
	}
	
	if (event.httpMethod.toUpperCase() === "GET" || event.httpMethod.toUpperCase() === "HEAD") delete options.body;
	
	var response = await fetch(url, options);
	var response_buffer = await response.buffer();
	var base64_encoded = response_buffer.toString("base64");
	var headers = response.headers.raw();
	
	var cookie_header = null;
	if (headers["set-cookie"]) cookie_header = headers["set-cookie"];
	
	return {
		statusCode: 200,
		isBase64Encoded: true,
		body: base64_encoded,
		headers: {
			"content-type": String(headers["content-type"]) || "text/plain"
		},
		multiValueHeaders: {
			"set-cookie": cookie_header || []
		}
	}
}