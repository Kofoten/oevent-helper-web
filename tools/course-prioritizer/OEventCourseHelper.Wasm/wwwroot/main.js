// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

import { dotnet } from './_framework/dotnet.js'

export function buildEngineResult(statusCode, errors, skippedControls, summaryStats, courseNames, requiredCount) {
    if (statusCode === 0) {
        return {
            success: true,
            summary: {
                totalCourseCount: summaryStats[0],
                requiredCourseCount: summaryStats[1],
                totalControlCount: summaryStats[2],
                visitedControlCount: summaryStats[3],
            },
            validationInfo: { skippedControls: skippedControls || [] },
            priorityOrder: courseNames.map((n, i) => ({
                courseName: n,
                required: i < requiredCount,
            })),
        }
    }

    let messages = errors;
    let resultType = "UnexpectedError";
    switch (statusCode) {
        case 1:
            resultType = "ParseStreamFailure";
            break;
        case 2:
            resultType = "ValidationFailure";
            messages = skippedControls.map(x => `Control ${x} could not be visited by any course.`);
            break;
        case 3:
            resultType = "NoSolutionFound";
            messages = `No course visited ${skippedControls.join(', ')}`;
            break;
    }
    
    return {
        success: false,
        error: {
            code: statusCode,
            type: resultType,
            messages: messages,
        } 
    }
}

const { setModuleImports, getAssemblyExports, getConfig } = await dotnet.create();

setModuleImports('main.js', {
    buildEngineResult
});

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

    console.log("Parsin course names...");

    const names = exports.OEventCourseHelper.Wasm.CourseListBridge.GetCourseNames(byteArray);

    console.log("Course names:", names);

    console.log("Passing XML data across the Wasm boundary to the C# Engine...");

    const result = exports.OEventCourseHelper.Wasm.EngineBridge.Prioritize(byteArray, 3, false, []);

    console.log("Engine finished:", result);
});
