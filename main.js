(function (){
    //refs: https://github.com/lasting-yang/frida_dump/blob/master/dump_dex.js
    var libart = Process.findModuleByName("libart.so");
    var SetJavaDebuggableFuncAddress = null;
    var SetJdwpAllowedAddress = null;
    // @ts-ignore
    var symbols = libart.enumerateSymbols();
    for (var index = 0; index < symbols.length; index++) {
        var symbol = symbols[index];
        var symbol_name = symbol.name;
        //refs: https://juejin.cn/post/6942782366993612813
        if (symbol_name.indexOf("Runtime") >= 0 &&
            symbol_name.indexOf("SetJavaDebuggable") >= 0) {
            console.log(symbol_name, symbol.address);
            if(SetJavaDebuggableFuncAddress==null)SetJavaDebuggableFuncAddress = symbol.address;
        }
        if (symbol_name.indexOf("art") >= 0 &&
            symbol_name.indexOf("Dbg") >= 0 &&
            symbol_name.indexOf("SetJdwpAllowed") >= 0) {
            console.log(symbol_name, symbol.address);
            if(SetJdwpAllowedAddress==null)SetJdwpAllowedAddress = symbol.address;
        }
    }
    //refs: http://139.9.180.229/chenminglin/myhooktest/blob/ae214dbecfba86846e0395e76cf0bf134da05725/EpicPrivacyCount/src/main/cpp/art.h#L154
    // @ts-ignore
    const vmPtr=Java.vm.handle;//refs: https://zhuanlan.zhihu.com/p/557373191
    console.log("vmPtr:",vmPtr);
    const artRuntimePtr=vmPtr.add(Process.pointerSize).readPointer();//refs: https://github.com/frida/frida-java-bridge/blob/main/lib/android.js#L450
    console.log("artRuntimePtr:",artRuntimePtr);
    if(SetJavaDebuggableFuncAddress==null){
        return
    }
    var SetJavaDebuggableFunc=new NativeFunction(SetJavaDebuggableFuncAddress,'void',['pointer','bool']);//refs: https://frida.re/docs/javascript-api/#nativefunction
    if(SetJavaDebuggableFunc==null){
        return;
    }
    console.log("SetJavaDebuggableFunc:",SetJavaDebuggableFunc);
    SetJavaDebuggableFunc(artRuntimePtr,1);
    if(SetJdwpAllowedAddress==null){
        return
    }
    var SetJdwpAllowedFunc=new NativeFunction(SetJdwpAllowedAddress,'void',['bool']);//refs: https://frida.re/docs/javascript-api/#nativefunction
    if(SetJdwpAllowedFunc==null){
        return;
    }
    console.log("SetJdwpAllowedFunc:",SetJdwpAllowedFunc);
    SetJdwpAllowedFunc(1);
})();
