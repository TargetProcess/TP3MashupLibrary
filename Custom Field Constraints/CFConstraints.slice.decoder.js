tau.mashups
    .addModule('CFConstraints.slice.decoder', function() {
        var SliceDecoder = function() {
        };

        SliceDecoder.prototype = {
            decode: function(value) {
                if (value.indexOf('b64_') !== 0) {
                    return value;
                }

                var encoded = value;
                encoded = encoded.replace(/_0/g, '+');
                encoded = encoded.replace(/_1/g, '/');
                encoded = encoded.replace(/_2/g, '=');
                encoded = encoded.substring(4, encoded.length - 1);
                return this._decodeBase64(encoded);
            },

            _decodeBase64: function(s) {
                var e = {}, i, v = [], r = '', w = String.fromCharCode, z;
                var n = [
                    [65, 91],
                    [97, 123],
                    [48, 58],
                    [43, 44],
                    [47, 48]
                ];

                for (z in n) {//noinspection JSUnfilteredForInLoop
                    for (i = n[z][0]; i < n[z][1]; i++) {
                        v.push(w(i));
                    }
                }
                for (i = 0; i < 64; i++) {
                    e[v[i]] = i;
                }

                for (i = 0; i < s.length; i += 72) {
                    var b = 0, c, x, l = 0, o = s.substring(i, i + 72);
                    for (x = 0; x < o.length; x++) {
                        c = e[o.charAt(x)];
                        b = (b << 6) + c;
                        l += 6;
                        while (l >= 8) {
                            r += w((b >>> (l -= 8)) % 256);
                        }
                    }
                }
                return r.replace(/[^\w\s]/gi, '');
            }
        };

        return SliceDecoder;
    });

