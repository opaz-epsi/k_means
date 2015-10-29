function Color(r,g,b) {
    function distanceFrom(color) {
        return (color.r - r) * (color.r - r) +
            (color.g - g) * (color.g - g) +
            (color.b - b) * (color.b - b)
    }

    function clone() {
        return Color(r, g, b);
    }

    function equals(color) {
        return (r == color.r && g == color.g && b == color.b);
    }

    function hex() {
        var rgb = b | (g << 8) | (r << 16);
        return '#' + rgb.toString(16);
    }

    return {
        r: r,
        g: g,
        b: b,

        distanceFrom: distanceFrom,
        clone: clone,
        equals: equals,
        hex: hex
    }
}