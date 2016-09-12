var rPhone = /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;

$.extend(fn, {
	checkPhone: function () {
		var value = $(".form .phone").val();
		if(value === '') {
            fn.tips('.tips .phone-li');
            return;
        }
        if(!rPhone.test(value)) {
            fn.tips('.tips .phone-li');
            return false;
        }
        return true;
	}
});