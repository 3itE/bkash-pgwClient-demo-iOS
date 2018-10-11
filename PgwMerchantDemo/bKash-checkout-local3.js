/**
 * Created by dni_tahniat on 2/14/2018.
 */

const bKash = (function () {
    var scriptData;
    var createRequestResponse;

    const bKash = new bKashPGW();

    return {
        init: function (data) {
            bKash.manager.init(data);
        },
        reconfigure: function (data) {
            bKash.manager.reconfigure(data);
        },
        create: function () {
            return bKash.manager.create();
        },
        execute: function () {
            return bKash.manager.execute();
        }
    };


    function bKashPGW() {
        this.manager = new Manager();

        this.settings =
            {
                iframeid: "",
                host: "http://10.21.30.189:9084/checkout",
                // host : "https://client.dev.labs.bka.sh/checkout",
                // host : "https://client.sit.labs.bka.sh/checkout",
                // host : "https://client.dev.bka.sh/checkout",
                // host : "https://client.sit.bka.sh/checkout",
                // host : "https://client.sandbox.bka.sh/checkout",
                // host : "https://client.pay.bka.sh/checkout",
                host_context: "http://10.21.30.189:9084",
                // host_context : "https://client.dev.labs.bka.sh",
                // host_context : "https://client.sit.labs.bka.sh",
                // host_context : "https://client.dev.bka.sh",
                // host_context : "https://client.sit.bka.sh",
                // host_context : "https://client.sandbox.bka.sh",
                // host_context : "https://client.pay.bka.sh",
                bKashButtonID: "#bKash_button",
            }
    }


    function Manager() {
        //INIT METHOD
        this.init = function (data) {
            console.log('inside bKashButton render ...');
            button_id = bKash.settings.bKashButtonID;
            scriptData = data;

            console.log('paymentMode :: ' + scriptData.paymentMode);

            console.log('paymentReq :: ');
            console.log(scriptData.paymentRequest);

            createFrameWrapper();

            $(button_id).click(function () {

                applyCSStoFrameWrapper();
                scriptData.createRequest(scriptData.paymentRequest);
            });

            setupiFrame();
            setupHostMessageListener();

        },
            //RECONFIGURE METHOD
            this.reconfigure = function (data) {
                console.log('inside bKashButton reconfigure ...');

                if (data.paymentRequest) {
                    scriptData.paymentRequest = data.paymentRequest;
                }
                console.log('paymentMode :: ' + scriptData.paymentMode);

                console.log('paymentReq :: ');
                console.log(scriptData.paymentRequest);


                //pre1.7
                $(button_id).prop('onclick', null).off('click');
                //1.7+
                $(button_id).attr('onclick', '').unbind('click');

                closeiFrame();
                createFrameWrapper();


                $(button_id).click(function () {
                    applyCSStoFrameWrapper();

                    scriptData.createRequest(scriptData.paymentRequest);
                });

                setupiFrame();


            },


            //CREATE METHOD
            this.create = (function () {

                    var reqData;

                    return {
                        onSuccess : function(data){
                            console.log('=> create');
                            console.log('data :: ');
                            console.log(data);


                            createRequestResponse = data;
                            console.log('createRequestResponse :: ');
                            console.log(createRequestResponse);


                            if (scriptData.paymentMode == 'checkout') {
                                data.amount = scriptData.paymentRequest.amount;
                                reqData = {paymentData: data, url: 'toLogin'};
                            }
                            passMessageToHost(reqData);
                        },
                        onError : function(){

                            closeiFrame();

                            setupiFrame();
                        }
                    };

            }),

            //EXECUTE METHOD
            this.execute = (function () {

                return {
                    onError : function(){


                        closeiFrame();
                        setupiFrame();
                    }
                }

            });
    }



    function createFrameWrapper(){
        $(bKash.settings.bKashButtonID).after('<div id="bKashFrameWrapper"></div>');
    }

    function applyCSStoFrameWrapper(){
        $('#bKashFrameWrapper').css('-webkit-overflow-scrolling','touch');
        $('#bKashFrameWrapper').css('overflow-y','scroll');
        $('#bKashFrameWrapper').css('position','fixed');
        $('#bKashFrameWrapper').css('right','0');
        $('#bKashFrameWrapper').css('bottom','0');
        $('#bKashFrameWrapper').css('left','0');
        $('#bKashFrameWrapper').css('top','0');
        $('#bKashFrameWrapper iframe').css('height','100%');
        $('#bKashFrameWrapper iframe').css('width','100%');

    }

    function closeiFrame(){
        $('#bKashFrameWrapper').removeAttr( 'style' );
        $('#bKashFrameWrapper').empty();
    }

    function setupiFrame() {

        if (scriptData.paymentMode == 'checkout') {

            bKash.settings.iframeid = "bKash-iFrame-" + Math.floor(Math.random() * 100) + 1;

            $('#bKashFrameWrapper').append('<iframe id=' + bKash.settings.iframeid + ' frameborder="0" allowtransparency="true" src="' + bKash.settings.host + '" name="bKash_checkout_app"  style="z-index: 50000; display: none; background: rgba(0, 0, 0, 0.004); border: 0px none transparent; margin: 0px; padding: 0px; -webkit-tap-highlight-color: transparent;" ></iframe>');

        }
    }


    function setupHostMessageListener() {
        console.log('=> setupHostMessageListener');
        //just to enable receiving message from the iframe
        if (window.addEventListener) {   // all browsers except IE before version 9
            window.addEventListener("message", getMessageFromHost, false);
        }
        else {
            if (window.attachEvent) {   // IE before version 9
                window.attachEvent("onmessage", getMessageFromHost);
            }
        }
    }


    function getMessageFromHost(result) {

        console.log('=> getMessageFromHost :: ');
        console.log(result);
        if (result != null && result.data != null && result.data != '') {
            console.log('=> function getMessageFromHost() :: result.data and result.origin');
            console.log(result.data);
            console.log(result.origin);
            // console.log(result.data.action);
            var obj = JSON.parse(result.data);

            if (result.origin === bKash.settings.host_context && (scriptData.paymentMode == 'checkout')) {
                console.log('getMessageFromHost :: origin validation completed ..');
                if (obj.action === 'afterLogin') {
                    if (obj.successful == 'Y') {
                        console.log('Login successful!');
                        // var otp = {url:'toOTP'};
                        var data = {paymentData: obj.data.paymentData, url: 'toOTP'};

                        passMessageToHost(data);
                    }
                }

                else if (obj.action === 'afterOTP') {
                    if (obj.successful == 'Y') {
                        console.log('OTP has been verified successfully!');

                        var data = {paymentData: obj.data.paymentData, url: 'toPIN', otpResponseData: obj.result};

                        passMessageToHost(data);
                    } else {
                        //otp verification unsuccessful
                    }
                }
                else if (obj.action === 'afterPIN') {
                    if (obj.successful == 'Y') {


                        scriptData.executeRequestOnAuthorization();

                    }
                }

                else if (obj.action === 'closeiFrame') {

                    closeiFrame();

                    setupiFrame();
                }

            }

            else {
                console.log('bKash.settings.host not valid');
            }
        }
    }

    function passMessageToHost(message) {
        console.log('=> checkout :: passMessageToHost');

        console.log('bKash.settings.iframeid :: ' + bKash.settings.iframeid);
        console.log('bKash.settings.host :: ' + bKash.settings.host);
        console.log('json stringified message :: ' + JSON.stringify(message));
        var frm = document.getElementById(bKash.settings.iframeid);
        frm.style.display = "block";
        frm.contentWindow.postMessage(JSON.stringify(message), bKash.settings.host);
        // frm.contentWindow.postMessage(message,bKash.settings.host);
    }

})();