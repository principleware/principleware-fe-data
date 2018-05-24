//
// Author:: Tom Tang <principlewar@gmai.com>
// Copyright:: Copyright (c) 2017, Xiaolong Tang
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// Except as contained in this notice, the name(s) of the above copyright
// holders shall not be used in advertising or otherwise to promote the
// sale, use or other dealings in this Software without prior written
// authorization.

export interface IJoinpoint {
    // Context (i.e. this) of the original method call
    target: any;

    // Array of arguments passed to the original method call
    args: any[];

    // Name of the original method
    method: string;

    // When, called, causes the original method to be invoked
    // When called without arguments, the original arguments will
    // be passed.
    // When called with arguments, they will be passed
    // *instead of* the original arguments
    proceed: (...args: any[]) => any;

    // Similar to proceed, but accepts an Array of new
    // arguments, (like Function.apply)
    proceedApply: (...args: any[]) => any;

    // Returns the number of times proceed and/or proceedApply
    // have been called
    proceedCount: (...args: any[]) => any;
}
