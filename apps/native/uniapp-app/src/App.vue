<script>
export default {
	onLaunch() {
		console.info("Application launched");
	},
};
</script>

<style>
page {
	min-height: 100%;
	background: #f7f8fa;
	color: #20242a;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

view,
text,
button,
input,
image {
	box-sizing: border-box;
}

button::after {
	border: 0;
}

.page-shell {
	width: 100%;
	max-width: 920px;
	min-height: 100vh;
	margin: 0 auto;
	padding: 36rpx 28rpx 56rpx;
}

.page-header {
	margin-bottom: 32rpx;
}

.page-kicker,
.page-title,
.page-description {
	display: block;
}

.page-kicker {
	margin-bottom: 12rpx;
	color: #087f5b;
	font-size: 22rpx;
	font-weight: 700;
}

.page-title {
	margin-bottom: 12rpx;
	font-size: 42rpx;
	font-weight: 700;
	line-height: 1.25;
}

.page-description {
	color: #69717d;
	font-size: 26rpx;
	line-height: 1.6;
}

.metric-strip {
	display: flex;
	margin-bottom: 36rpx;
	padding: 24rpx 8rpx;
	border-radius: 12rpx;
	background: #252a31;
	color: #ffffff;
}

.metric-strip--light {
	border: 1px solid #e0e4e8;
	background: #ffffff;
	color: #20242a;
}

.metric-item {
	flex: 1;
	min-width: 0;
	padding: 0 16rpx;
	text-align: center;
}

.metric-item + .metric-item {
	border-left: 1px solid rgba(255, 255, 255, 0.18);
}

.metric-strip--light .metric-item + .metric-item {
	border-left-color: #e0e4e8;
}

.metric-value,
.metric-label {
	display: block;
}

.metric-value {
	margin-bottom: 6rpx;
	font-size: 34rpx;
	font-weight: 700;
}

.metric-label {
	color: #b8c0ca;
	font-size: 22rpx;
}

.metric-strip--light .metric-label {
	color: #69717d;
}

.section-heading,
.result-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
}

.section-heading {
	margin: 34rpx 0 16rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: 700;
}

.section-meta {
	color: #7b8490;
	font-size: 22rpx;
}

.menu-list,
.form-panel,
.result-panel {
	border: 1px solid #e0e4e8;
	border-radius: 12rpx;
	background: #ffffff;
}

.menu-list {
	overflow: hidden;
}

.menu-row {
	display: flex;
	align-items: center;
	min-height: 112rpx;
	padding: 22rpx 24rpx;
	background: #ffffff;
}

.menu-row + .menu-row {
	border-top: 1px solid #edf0f2;
}

.menu-row--active {
	background: #f1f8f5;
}

.menu-copy {
	flex: 1;
	min-width: 0;
}

.menu-title,
.menu-description {
	display: block;
}

.menu-title {
	margin-bottom: 6rpx;
	font-size: 28rpx;
	font-weight: 600;
}

.menu-description {
	overflow: hidden;
	color: #69717d;
	font-size: 23rpx;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.menu-arrow {
	width: 48rpx;
	color: #087f5b;
	font-size: 40rpx;
	text-align: right;
}

.form-panel,
.result-panel {
	margin-bottom: 24rpx;
	padding: 24rpx;
}

.field-label,
.inline-result {
	display: block;
	font-size: 24rpx;
}

.field-label {
	margin-bottom: 12rpx;
	color: #4c5561;
	font-weight: 600;
}

.field-label:not(:first-child) {
	margin-top: 22rpx;
}

.text-input {
	width: 100%;
	height: 82rpx;
	margin-bottom: 20rpx;
	padding: 0 20rpx;
	border: 1px solid #cfd5da;
	border-radius: 8rpx;
	background: #ffffff;
	font-size: 27rpx;
}

.action-row,
.action-grid,
.action-column {
	display: flex;
	gap: 16rpx;
}

.action-grid {
	flex-wrap: wrap;
	margin-bottom: 24rpx;
}

.action-column {
	flex-direction: column;
}

.action-button {
	flex: 1;
	min-width: 0;
	height: 78rpx;
	margin: 0;
	padding: 0 18rpx;
	border: 1px solid #cfd5da;
	border-radius: 8rpx;
	background: #ffffff;
	color: #303741;
	font-size: 25rpx;
	line-height: 76rpx;
}

.action-grid .action-button {
	flex: 0 0 calc(50% - 8rpx);
}

.action-button--primary {
	border-color: #087f5b;
	background: #087f5b;
	color: #ffffff;
}

.action-button--danger {
	border-color: #d9485f;
	color: #b4233a;
}

.action-button[disabled] {
	opacity: 0.55;
}

.text-button {
	height: 72rpx;
	margin: 28rpx 0 0;
	background: transparent;
	color: #087f5b;
	font-size: 25rpx;
	line-height: 72rpx;
}

.result-heading {
	margin-bottom: 20rpx;
}

.status-badge {
	padding: 6rpx 12rpx;
	border-radius: 6rpx;
	font-size: 20rpx;
}

.status-badge--neutral {
	background: #edf0f2;
	color: #59626e;
}

.status-badge--success {
	background: #e5f6ef;
	color: #087f5b;
}

.status-badge--error {
	background: #fdecef;
	color: #b4233a;
}

.code-block {
	display: block;
	min-height: 144rpx;
	overflow-wrap: anywhere;
	color: #303741;
	font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
	font-size: 23rpx;
	line-height: 1.65;
	white-space: pre-wrap;
}

.inline-result {
	margin-top: 18rpx;
	color: #69717d;
	overflow-wrap: anywhere;
}

.image-preview {
	display: block;
	width: 100%;
	height: 320rpx;
	margin-top: 20rpx;
	border-radius: 8rpx;
	background: #edf0f2;
}
</style>
