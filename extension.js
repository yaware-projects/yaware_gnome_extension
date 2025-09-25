const { Gio, Shell, GLib } = imports.gi;

Gio._promisify(Shell.Screenshot.prototype, 'pick_color');
Gio._promisify(Shell.Screenshot.prototype, 'screenshot');
Gio._promisify(Shell.Screenshot.prototype, 'screenshot_window');
Gio._promisify(Shell.Screenshot.prototype, 'screenshot_area');
Gio._promisify(Shell.Screenshot.prototype, 'screenshot_stage_to_content');
Gio._promisify(Shell.Screenshot, 'composite_to_stream');

const MR_DBUS_IFACE = `
<node>
    <interface name="org.gnome.Shell.Extensions.Yaware">
        <method name="ListWindow">
            <arg type="s" direction="out" name="windows"/>
        </method>
    <method name="ActiveWindow">
        <arg type="s" direction="out" name="window"/>
    </method>
    <method name="TakeScreenshot">
        <arg type="b" direction="in" name="includeCursor"/>
        <arg type="s" direction="in" name="inputPath"/>
        <arg type="b" direction="out" name="result"/>
    </method>
    </interface>
</node>`;


class Extension {
    enable() {
        this._dbus = Gio.DBusExportedObject.wrapJSObject(MR_DBUS_IFACE, this);
        this._dbus.export(Gio.DBus.session, '/org/gnome/Shell/Extensions/Yaware');
    }

    disable() {
        this._dbus.flush();
        this._dbus.unexport();
        delete this._dbus;
    }

    ListWindow() {
        let win = global.get_window_actors()
            .map(a => a.meta_window)
            .map(w => ({ id: w.get_id(), pid: w.get_pid(), class: w.get_wm_class(), title: w.get_title(), focus: w.has_focus()}));
        return JSON.stringify(win);
    }

    ActiveWindow() {
        let win = global.get_window_actors()
            .map(a => a.meta_window)
            .map(w => ({ id: w.get_id(), pid: w.get_pid(), class: w.get_wm_class(), title: w.get_title(), focus: w.has_focus() }))
            .filter(function(w) { return w.focus === true; });
        return JSON.stringify(win);
    }

    async TakeScreenshot(includeCursor, inputPath) {
        if (inputPath == '')
            return false;

        let shooter = new Shell.Screenshot();
        if (!shooter)
            return false;

        let file = Gio.File.new_for_path(inputPath);
        let stream = file.replace(null, false, Gio.FileCreateFlags.NONE, null);
        let [area] = await shooter.screenshot(includeCursor, stream);
        stream.close(null);
        return true;
    }
}

function init() {
    return new Extension();
}