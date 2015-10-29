function ImageCanvas(elementId) {
    var canvas = document.getElementById(elementId);
    var context = canvas.getContext("2d");
    var pixels = null;

    function draw(imageURL, success) {
        var image = new Image();
        image.onload = function () {
            canvas.height = image.height * canvas.width / image.width;
            context.drawImage(this, 0, 0, canvas.width, canvas.height);

            var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
            pixels = imgData.data;

            if (success) success();
        }
        image.src = imageURL;
    }

    function forEachPixel(callback) {
        for (var x = 0; x < canvas.width; x++) {
            for (var y = 0; y < canvas.height; y++) {
                var pixel = this.pixelAtPosition(x, y);
                callback(context, pixel)
            }
        }
    }

    function pixelAtPosition(x, y) {
        var pixelIndex = (y * canvas.width + x) * 4;
        return pixelAtIndex(pixelIndex);
    }

    function pixelAtIndex(pixelIndex) {
        var y = pixelIndex % canvas.width;
        var x = (pixelIndex - y) / canvas.width;
        return Pixel(
            x,
            y,
            pixels[pixelIndex],
            pixels[pixelIndex + 1],
            pixels[pixelIndex + 2]);
    }

    return {
        draw:  draw,
        forEachPixel: forEachPixel,
        pixelAtPosition: pixelAtPosition,
        pixelAtIndex: pixelAtIndex

    }
}

function Pixel(x, y, r, g, b) {
    return {
        x: x,
        y: y,
        color: Color(r,g,b),
    };
}
