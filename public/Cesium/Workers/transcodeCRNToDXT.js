define(["./CompressedTextureBuffer-2218e2dc","./when-207a1520","./PixelFormat-4b0141b1","./RuntimeError-b98f87df","./createTaskProcessorWorker","./WebGLConstants-8d1e45f7"],(function(e,r,t,n,a,s){"use strict";
/**
     * @license
     *
     * Copyright (c) 2014, Brandon Jones. All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without modification,
     * are permitted provided that the following conditions are met:
     *
     *  * Redistributions of source code must retain the above copyright notice, this
     *  list of conditions and the following disclaimer.
     *  * Redistributions in binary form must reproduce the above copyright notice,
     *  this list of conditions and the following disclaimer in the documentation
     *  and/or other materials provided with the distribution.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
     * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
     * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
     * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
     * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
     * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     */var f,o,i=1,u=2,c={};c[0]=t.PixelFormat.RGB_DXT1,c[i]=t.PixelFormat.RGBA_DXT3,c[u]=t.PixelFormat.RGBA_DXT5;var _,l=0;function m(a,s){var i=a.data,u=i.byteLength,m=new Uint8Array(i),d=_._malloc(u);!function(e,r,t,n){var a,s=t/4,f=n%4,o=new Uint32Array(e.buffer,0,(n-f)/4),i=new Uint32Array(r.buffer);for(a=0;a<o.length;a++)i[s+a]=o[a];for(a=n-f;a<n;a++)r[t+a]=e[a]}(m,_.HEAPU8,d,u);var b=_._crn_get_dxt_format(d,u),w=c[b];if(!r.e(w))throw new n.t("Unsupported compressed format.");var p,y=_._crn_get_levels(d,u),g=_._crn_get_width(d,u),h=_._crn_get_height(d,u),v=0;for(p=0;p<y;++p)v+=t.PixelFormat.compressedTextureSizeInBytes(w,g>>p,h>>p);if(l<v&&(r.e(f)&&_._free(f),f=_._malloc(v),o=new Uint8Array(_.HEAPU8.buffer,f,v),l=v),_._crn_decompress(d,u,f,v,0,y),_._free(d),r.u(a.bMipMap,!1)){var x=o.slice(0,v);return s.push(x.buffer),new e.e(w,g,h,x)}var A=t.PixelFormat.compressedTextureSizeInBytes(w,g,h),P=o.subarray(0,A),U=new Uint8Array(A);return U.set(P,0),s.push(U.buffer),new e.e(w,g,h,U)}function d(e){_=e,self.onmessage=a(m),self.postMessage(!0)}return function(e){var t=e.data.webAssemblyConfig;if(r.e(t))return require([t.modulePath],(function(e){r.e(t.wasmBinaryFile)?(r.e(e)||(e=self.Module),d(e)):d(e)}))}}));
