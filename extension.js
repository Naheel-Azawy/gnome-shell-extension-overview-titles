const Workspace = imports.ui.workspace;
const AppDisplay = imports.ui.appDisplay;
const PopupMenu = imports.ui.popupMenu;

let origins = [];

function inject_fun(parent, name, fun) {
	let origin = parent[name];
	origins[name] = origin;
	parent[name] = function() {
		let origin_ret = origin.apply(this, arguments);
		if (origin_ret !== undefined) return origin_ret;
		return fun.apply(this, arguments);
	}
}

function inject_fun_top(parent, name, fun) {
	let origin = parent[name];
	origins[name] = origin;
	parent[name] = function() {
		let fun_ret = fun.apply(this, arguments);
		if (fun_ret !== undefined) return fun_ret;
		return origin.apply(this, arguments);
	}
}

function remove_fun(parent, name) {
	parent[name] = origins[name];
}

function init() {
}

function enable() {
	inject_fun_top(Workspace.WindowOverlay.prototype, "relayout", function(animate) {
		let [cloneX, cloneY, cloneWidth, cloneHeight] = this._windowClone.slot;
		let borderWidth = cloneWidth + 2 * this.borderSize;
		if (this.title.width >= borderWidth)
			this.title.width = borderWidth;
	});
	inject_fun_top(AppDisplay.AppIconMenu.prototype, "_appendMenuItem",  function(labelText) {
		if (labelText.length > 50)
			labelText = labelText.substring(0, 50) + "...";
		let item = new PopupMenu.PopupMenuItem(labelText);
		this.addMenuItem(item);
		return item;
	});
}

function disable() {
	remove_fun(Workspace.WindowOverlay.prototype, "relayout");
	remove_fun(AppDisplay.AppIconMenu.prototype, "_appendMenuItem");
}




