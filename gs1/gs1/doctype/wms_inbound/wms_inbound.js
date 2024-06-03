// Copyright (c) 2024, https://github.com/fiedag and contributors
// For license information, please see license.txt

frappe.ui.form.on('WMS Inbound', {

	
	scan_barcode: function(frm) {
	    console.log("in scan_barcode function");
	    frappe.flags.dialog_set = false;
	    
	    const opts = {
	        frm: frm,
	        scan_field_name: "scan_barcode",
	        scan_api: "erpnext.stock.utils.scan_barcode",
	        
	    };
	    
		const barcode_scanner = new erpnext.utils.BarcodeScanner(opts);
		barcode_scanner.process_scan();
	},
	
	item_code: function(frm, cdt, cdn) {
	    console.log("inside item_code handler");
	    return frappe.call({
				doc: frm.doc,
				method: "get_item_details",
				args: args,
				callback: function (r) {
					if (r.message) {
						var d = locals[cdt][cdn];
						$.each(r.message, function (k, v) {
							if (v) {
								frappe.model.set_value(cdt, cdn, k, v); // qty and it's subsequent fields weren't triggered
							}
						});
						refresh_field("items");

						let no_batch_serial_number_value = false;
						if (d.has_serial_no || d.has_batch_no) {
							no_batch_serial_number_value = true;
						}

						if (
							no_batch_serial_number_value &&
							!frappe.flags.hide_serial_batch_dialog &&
							!frappe.flags.dialog_set
						) {
							frappe.flags.dialog_set = true;
							erpnext.stock.select_batch_and_serial_no(frm, d);
						} else {
							frappe.flags.dialog_set = false;
						}
					}
				},
			});
	}
})

