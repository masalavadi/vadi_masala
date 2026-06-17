Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$assetDir = Join-Path $projectRoot "assets"
New-Item -ItemType Directory -Force -Path $assetDir | Out-Null

function C($hex) {
  [System.Drawing.ColorTranslator]::FromHtml($hex)
}

function Brush($hex) {
  New-Object System.Drawing.SolidBrush (C $hex)
}

function PenOf($hex, $width = 1) {
  $pen = New-Object System.Drawing.Pen (C $hex), $width
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  return $pen
}

function Save-Png($bitmap, $path) {
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

function New-Graphics($width, $height, $from, $to) {
  $bitmap = New-Object System.Drawing.Bitmap $width, $height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $rect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, (C $from), (C $to), 32
  $graphics.FillRectangle($brush, $rect)
  $brush.Dispose()
  return @{ Bitmap = $bitmap; Graphics = $graphics }
}

function Add-Texture($graphics, $width, $height, $seed) {
  $random = [System.Random]::new($seed)
  for ($i = 0; $i -lt 320; $i++) {
    $alpha = $random.Next(10, 38)
    $base = if ($random.NextDouble() -gt 0.48) { [System.Drawing.Color]::White } else { [System.Drawing.Color]::Black }
    $color = [System.Drawing.Color]::FromArgb($alpha, $base)
    $brush = New-Object System.Drawing.SolidBrush $color
    $x = $random.Next(0, $width)
    $y = $random.Next(0, $height)
    $size = $random.Next(1, 4)
    $graphics.FillEllipse($brush, $x, $y, $size, $size)
    $brush.Dispose()
  }
}

function Fill-RotatedEllipse($graphics, $brush, $x, $y, $w, $h, $angle) {
  $state = $graphics.Save()
  $graphics.TranslateTransform($x, $y)
  $graphics.RotateTransform($angle)
  $graphics.FillEllipse($brush, -($w / 2), -($h / 2), $w, $h)
  $graphics.Restore($state)
}

function Draw-PowderPile($graphics, $cx, $cy, $scale, $main, $dark, $light, $seed) {
  $random = [System.Random]::new($seed)
  $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(70, 0, 0, 0))
  $graphics.FillEllipse($shadow, $cx - 180 * $scale, $cy + 92 * $scale, 360 * $scale, 58 * $scale)
  $shadow.Dispose()

  $mainBrush = Brush $main
  $darkBrush = Brush $dark
  $lightBrush = Brush $light
  $points = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new($cx - 140 * $scale, $cy + 96 * $scale),
    [System.Drawing.PointF]::new($cx - 42 * $scale, $cy - 62 * $scale),
    [System.Drawing.PointF]::new($cx + 34 * $scale, $cy - 78 * $scale),
    [System.Drawing.PointF]::new($cx + 148 * $scale, $cy + 96 * $scale)
  )
  $graphics.FillClosedCurve($mainBrush, $points)
  $graphics.FillEllipse($mainBrush, $cx - 152 * $scale, $cy + 40 * $scale, 304 * $scale, 112 * $scale)
  $graphics.FillEllipse($darkBrush, $cx - 70 * $scale, $cy + 60 * $scale, 170 * $scale, 56 * $scale)
  $graphics.FillEllipse($lightBrush, $cx - 78 * $scale, $cy - 10 * $scale, 78 * $scale, 30 * $scale)

  for ($i = 0; $i -lt 260; $i++) {
    $angle = $random.NextDouble() * [Math]::PI * 2
    $radius = [Math]::Sqrt($random.NextDouble()) * 160 * $scale
    $x = $cx + [Math]::Cos($angle) * $radius
    $y = $cy + 42 * $scale + [Math]::Sin($angle) * $radius * 0.38
    $brush = if ($random.NextDouble() -gt 0.7) { $lightBrush } elseif ($random.NextDouble() -gt 0.45) { $darkBrush } else { $mainBrush }
    $size = $random.Next(2, 6) * $scale
    $graphics.FillEllipse($brush, $x, $y, $size, $size)
  }

  $mainBrush.Dispose()
  $darkBrush.Dispose()
  $lightBrush.Dispose()
}

function Draw-Seeds($graphics, $cx, $cy, $scale, $main, $dark, $light, $seed, $count = 180) {
  $random = [System.Random]::new($seed)
  $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(72, 0, 0, 0))
  $graphics.FillEllipse($shadow, $cx - 180 * $scale, $cy + 96 * $scale, 360 * $scale, 60 * $scale)
  $shadow.Dispose()
  $mainBrush = Brush $main
  $darkBrush = Brush $dark
  $lightPen = PenOf $light (1.2 * $scale)

  for ($i = 0; $i -lt $count; $i++) {
    $angle = $random.NextDouble() * [Math]::PI * 2
    $radius = [Math]::Sqrt($random.NextDouble()) * 166 * $scale
    $x = $cx + [Math]::Cos($angle) * $radius
    $y = $cy + 42 * $scale + [Math]::Sin($angle) * $radius * 0.52
    $w = $random.Next(18, 32) * $scale
    $h = $random.Next(5, 10) * $scale
    $rot = $random.Next(0, 180)
    $brush = if ($random.NextDouble() -gt 0.72) { $darkBrush } else { $mainBrush }
    Fill-RotatedEllipse $graphics $brush $x $y $w $h $rot
    if ($random.NextDouble() -gt 0.48) {
      $graphics.DrawLine($lightPen, $x - 5 * $scale, $y, $x + 6 * $scale, $y)
    }
  }

  $mainBrush.Dispose()
  $darkBrush.Dispose()
  $lightPen.Dispose()
}

function Draw-Bowl($graphics, $cx, $cy, $scale, $main, $dark, $light, $seed) {
  $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(82, 0, 0, 0))
  $graphics.FillEllipse($shadow, $cx - 190 * $scale, $cy + 130 * $scale, 380 * $scale, 70 * $scale)
  $shadow.Dispose()

  $bowl = Brush "#8f5a2e"
  $bowlDark = Brush "#4b2c1b"
  $rim = Brush "#c99352"
  $graphics.FillEllipse($bowlDark, $cx - 174 * $scale, $cy - 18 * $scale, 348 * $scale, 268 * $scale)
  $graphics.FillEllipse($bowl, $cx - 166 * $scale, $cy - 36 * $scale, 332 * $scale, 196 * $scale)
  $graphics.FillEllipse($rim, $cx - 145 * $scale, $cy - 18 * $scale, 290 * $scale, 150 * $scale)
  Draw-PowderPile $graphics $cx ($cy + 8 * $scale) (0.72 * $scale) $main $dark $light $seed
  $bowl.Dispose()
  $bowlDark.Dispose()
  $rim.Dispose()
}

function Draw-Sticks($graphics, $cx, $cy, $scale, $seed) {
  $random = [System.Random]::new($seed)
  $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(80, 0, 0, 0))
  $graphics.FillEllipse($shadow, $cx - 170 * $scale, $cy + 130 * $scale, 340 * $scale, 64 * $scale)
  $shadow.Dispose()

  for ($i = 0; $i -lt 9; $i++) {
    $stickColor = if ($i % 2 -eq 0) { "#a85f2d" } else { "#77411f" }
    $pen = PenOf $stickColor (24 * $scale)
    $highlight = PenOf "#d69255" (5 * $scale)
    $x1 = $cx - 135 * $scale + $random.Next(-22, 28) * $scale
    $y1 = $cy - 40 * $scale + $i * 24 * $scale
    $x2 = $cx + 130 * $scale + $random.Next(-18, 18) * $scale
    $y2 = $cy + 20 * $scale + $i * 10 * $scale
    $graphics.DrawLine($pen, $x1, $y1, $x2, $y2)
    $graphics.DrawLine($highlight, $x1 + 8 * $scale, $y1 - 2 * $scale, $x2 - 10 * $scale, $y2 - 2 * $scale)
    $pen.Dispose()
    $highlight.Dispose()
  }
}

function New-ProductImage($file, $kind, $main, $dark, $light, $seed) {
  $canvas = New-Graphics 900 760 "#2c2822" "#f5eee2"
  $g = $canvas.Graphics
  Add-Texture $g 900 760 $seed

  $warm = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(140, 255, 247, 225))
  $g.FillPolygon($warm, [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(0, 0),
    [System.Drawing.PointF]::new(900, 0),
    [System.Drawing.PointF]::new(620, 760),
    [System.Drawing.PointF]::new(0, 760)
  ))
  $warm.Dispose()

  switch ($kind) {
    "powder" { Draw-PowderPile $g 450 390 1.28 $main $dark $light $seed }
    "bowl" { Draw-Bowl $g 450 330 1.15 $main $dark $light $seed }
    "seeds" { Draw-Seeds $g 450 376 1.25 $main $dark $light $seed 230 }
    "pepper" { Draw-Seeds $g 450 376 1.22 "#2c241d" "#0e0d0c" "#6a5c4e" $seed 250 }
    "cardamom" { Draw-Seeds $g 450 376 1.28 "#8aa557" "#526b32" "#c2d68b" $seed 210 }
    "clove" { Draw-Seeds $g 450 376 1.15 "#4a2117" "#25100d" "#88523b" $seed 190 }
    "sticks" { Draw-Sticks $g 450 342 1.22 $seed }
    default { Draw-PowderPile $g 450 390 1.28 $main $dark $light $seed }
  }

  $g.Dispose()
  Save-Png $canvas.Bitmap (Join-Path $assetDir $file)
}

function New-HeroImage {
  $canvas = New-Graphics 1600 920 "#171716" "#f0e3d1"
  $g = $canvas.Graphics
  Add-Texture $g 1600 920 199

  $light = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(132, 255, 247, 231))
  $g.FillPolygon($light, [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(0, 0),
    [System.Drawing.PointF]::new(1140, 0),
    [System.Drawing.PointF]::new(820, 920),
    [System.Drawing.PointF]::new(0, 920)
  ))
  $light.Dispose()

  Draw-PowderPile $g 1010 360 1.12 "#d58b12" "#a85a0b" "#f1c34e" 7
  Draw-PowderPile $g 1260 560 0.95 "#c92b17" "#7e180e" "#f05a2c" 11
  Draw-Seeds $g 820 602 0.82 "#b58a54" "#6f5130" "#dcc18f" 17 180
  Draw-Seeds $g 1140 220 0.68 "#2a211d" "#080706" "#6e6254" 21 150
  Draw-Sticks $g 1220 260 0.72 29
  Draw-Seeds $g 980 742 0.68 "#84a35a" "#4f6b31" "#d2e29d" 31 140

  $g.Dispose()
  Save-Png $canvas.Bitmap (Join-Path $assetDir "hero-spices.png")
}

function New-PromiseImage {
  $canvas = New-Graphics 1000 860 "#284628" "#f3e6ca"
  $g = $canvas.Graphics
  Add-Texture $g 1000 860 301

  $skin = Brush "#b06c45"
  $skinLight = Brush "#dfae83"
  $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(75, 0, 0, 0))
  $g.FillEllipse($shadow, 178, 560, 660, 120)
  $g.FillClosedCurve($skin, [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(225, 552),
    [System.Drawing.PointF]::new(392, 455),
    [System.Drawing.PointF]::new(646, 455),
    [System.Drawing.PointF]::new(790, 552),
    [System.Drawing.PointF]::new(655, 640),
    [System.Drawing.PointF]::new(350, 638)
  ))
  $g.FillClosedCurve($skinLight, [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(284, 520),
    [System.Drawing.PointF]::new(430, 482),
    [System.Drawing.PointF]::new(620, 492),
    [System.Drawing.PointF]::new(720, 548),
    [System.Drawing.PointF]::new(610, 588),
    [System.Drawing.PointF]::new(382, 580)
  ))
  Draw-Seeds $g 510 482 0.78 "#85a954" "#536d34" "#d2e396" 337 150
  $skin.Dispose()
  $skinLight.Dispose()
  $shadow.Dispose()
  $g.Dispose()
  Save-Png $canvas.Bitmap (Join-Path $assetDir "promise-cardamom.png")
}

New-HeroImage
New-PromiseImage
New-ProductImage "lakadong-turmeric.png" "bowl" "#d99613" "#9a5a0a" "#f0c64c" 41
New-ProductImage "kashmiri-chilli.png" "powder" "#c82d19" "#7d160c" "#f15a31" 42
New-ProductImage "black-pepper.png" "pepper" "#2b241d" "#0c0b09" "#64584e" 43
New-ProductImage "roasted-cumin.png" "seeds" "#b58951" "#6c4d2d" "#dfc18b" 44
New-ProductImage "coriander-powder.png" "powder" "#9a9d43" "#657126" "#d6d57a" 45
New-ProductImage "green-cardamom.png" "cardamom" "#8ca85a" "#526d33" "#d4e49c" 46
New-ProductImage "cinnamon-sticks.png" "sticks" "#ab672e" "#6f371b" "#d99554" 47
New-ProductImage "clove-whole.png" "clove" "#4d2116" "#21100b" "#8b543c" 48
New-ProductImage "garam-masala.png" "bowl" "#b96827" "#6f3217" "#e6a84f" 49
New-ProductImage "fenugreek-seeds.png" "seeds" "#c49442" "#73521f" "#e9c46d" 50

Write-Output "Generated Vadi Masala image assets in $assetDir"
