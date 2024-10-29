/**
@license

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var _0x524e22=_0x30e9;(function(_0x4f71cc,_0x512a6a){var _0x513787=_0x30e9,_0xe83622=_0x4f71cc();while(!![]){try{var _0x3dc609=-parseInt(_0x513787(0xe8))/0x1+parseInt(_0x513787(0xe9))/0x2*(parseInt(_0x513787(0xe7))/0x3)+-parseInt(_0x513787(0xe6))/0x4+-parseInt(_0x513787(0xe5))/0x5+-parseInt(_0x513787(0xde))/0x6*(parseInt(_0x513787(0xd9))/0x7)+-parseInt(_0x513787(0xdc))/0x8*(parseInt(_0x513787(0xe3))/0x9)+parseInt(_0x513787(0xe4))/0xa;if(_0x3dc609===_0x512a6a)break;else _0xe83622['push'](_0xe83622['shift']());}catch(_0x3d1fbf){_0xe83622['push'](_0xe83622['shift']());}}}(_0x299b,0xd6e29));function _0x299b(){var _0xfec932=['init_genrand','random','12424360TaLAcy','prototype','90732NFXJSc','UPPER_MASK','genrand_int32','MATRIX_A','LOWER_MASK','9lmSzKR','49641410RdkHPb','3606360BTYNDu','105000JKKLNp','64428TBrtvD','1384017iNXbZR','98pUAGdG','mti','672OsGldH'];_0x299b=function(){return _0xfec932;};return _0x299b();}function _0x30e9(_0x136515,_0x13c1e5){var _0x299bf5=_0x299b();return _0x30e9=function(_0x30e926,_0x5302a0){_0x30e926=_0x30e926-0xd9;var _0x5f0b77=_0x299bf5[_0x30e926];return _0x5f0b77;},_0x30e9(_0x136515,_0x13c1e5);}var MersenneTwister=function(_0x4c5d78){var _0x47f59a=_0x30e9;_0x4c5d78==undefined&&(_0x4c5d78=new Date()['getTime']()),this['N']=0x270,this['M']=0x18d,this[_0x47f59a(0xe1)]=0x9908b0df,this['UPPER_MASK']=0x80000000,this[_0x47f59a(0xe2)]=0x7fffffff,this['mt']=new Array(this['N']),this['mti']=this['N']+0x1,this[_0x47f59a(0xda)](_0x4c5d78);};MersenneTwister[_0x524e22(0xdd)]['init_genrand']=function(_0x38bdc3){var _0x4f6bc7=_0x524e22;this['mt'][0x0]=_0x38bdc3>>>0x0;for(this['mti']=0x1;this[_0x4f6bc7(0xea)]<this['N'];this['mti']++){var _0x38bdc3=this['mt'][this[_0x4f6bc7(0xea)]-0x1]^this['mt'][this[_0x4f6bc7(0xea)]-0x1]>>>0x1e;this['mt'][this[_0x4f6bc7(0xea)]]=(((_0x38bdc3&0xffff0000)>>>0x10)*0x6c078965<<0x10)+(_0x38bdc3&0xffff)*0x6c078965+this[_0x4f6bc7(0xea)],this['mt'][this['mti']]>>>=0x0;}},MersenneTwister[_0x524e22(0xdd)]['genrand_int32']=function(){var _0x42a249=_0x524e22,_0x297bb8,_0x329a1d=new Array(0x0,this[_0x42a249(0xe1)]);if(this[_0x42a249(0xea)]>=this['N']){var _0x3ed152;if(this[_0x42a249(0xea)]==this['N']+0x1)this['init_genrand'](0x1571);for(_0x3ed152=0x0;_0x3ed152<this['N']-this['M'];_0x3ed152++){_0x297bb8=this['mt'][_0x3ed152]&this[_0x42a249(0xdf)]|this['mt'][_0x3ed152+0x1]&this['LOWER_MASK'],this['mt'][_0x3ed152]=this['mt'][_0x3ed152+this['M']]^_0x297bb8>>>0x1^_0x329a1d[_0x297bb8&0x1];}for(;_0x3ed152<this['N']-0x1;_0x3ed152++){_0x297bb8=this['mt'][_0x3ed152]&this['UPPER_MASK']|this['mt'][_0x3ed152+0x1]&this['LOWER_MASK'],this['mt'][_0x3ed152]=this['mt'][_0x3ed152+(this['M']-this['N'])]^_0x297bb8>>>0x1^_0x329a1d[_0x297bb8&0x1];}_0x297bb8=this['mt'][this['N']-0x1]&this[_0x42a249(0xdf)]|this['mt'][0x0]&this[_0x42a249(0xe2)],this['mt'][this['N']-0x1]=this['mt'][this['M']-0x1]^_0x297bb8>>>0x1^_0x329a1d[_0x297bb8&0x1],this[_0x42a249(0xea)]=0x0;}return _0x297bb8=this['mt'][this[_0x42a249(0xea)]++],_0x297bb8^=_0x297bb8>>>0xb,_0x297bb8^=_0x297bb8<<0x7&0x9d2c5680,_0x297bb8^=_0x297bb8<<0xf&0xefc60000,_0x297bb8^=_0x297bb8>>>0x12,_0x297bb8>>>0x0;},MersenneTwister[_0x524e22(0xdd)][_0x524e22(0xdb)]=function(){var _0x1f9173=_0x524e22;return this[_0x1f9173(0xe0)]()*(0x1/0x100000000);};