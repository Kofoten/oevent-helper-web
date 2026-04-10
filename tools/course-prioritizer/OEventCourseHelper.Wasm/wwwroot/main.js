// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

import { dotnet } from './_framework/dotnet.js'

const { getAssemblyExports, getConfig } = await dotnet.create();
const config = getConfig();

const exports = await getAssemblyExports(config.mainAssemblyName);

const fileInput = document.getElementById('xml-upload');

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);

    console.log("Passing XML data across the Wasm boundary to the C# Engine...");

    const result = exports.OEventCourseHelper.Wasm.CourseListBridge.GetCourseNames(byteArray); //, 3, false, []);

    console.log("Engine finished:", result);
});