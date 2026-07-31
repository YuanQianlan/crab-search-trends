import fs from "node:fs";
import path from "node:path";

const source = "D:/Desktop/竞赛/易智瑞/date/中国_省/中国_省/中国_省-MULTIPOLYGON.shp";
const target = path.resolve("assets", "brand-map", "china-provinces.js");
const buffer = fs.readFileSync(source);

function signedArea(ring) {
  let area = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return area / 2;
}

function readPolygon(offset, length, featureIndex) {
  const shapeType = buffer.readInt32LE(offset);
  if (shapeType === 0) return null;
  if (shapeType !== 5 && shapeType !== 15 && shapeType !== 25) {
    throw new Error(`Unsupported shape type ${shapeType}`);
  }

  const numParts = buffer.readInt32LE(offset + 36);
  const numPoints = buffer.readInt32LE(offset + 40);
  const parts = [];
  for (let i = 0; i < numParts; i++) {
    parts.push(buffer.readInt32LE(offset + 44 + i * 4));
  }
  const pointOffset = offset + 44 + numParts * 4;
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    points.push([
      Number(buffer.readDoubleLE(pointOffset + i * 16).toFixed(6)),
      Number(buffer.readDoubleLE(pointOffset + i * 16 + 8).toFixed(6)),
    ]);
  }

  const rings = parts.map((start, i) => {
    const end = i + 1 < parts.length ? parts[i + 1] : points.length;
    const ring = points.slice(start, end);
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
      ring.push([...first]);
    }
    return ring;
  }).filter(ring => ring.length >= 4);

  const polygons = [];
  for (const ring of rings) {
    if (signedArea(ring) < 0 || !polygons.length) {
      polygons.push([ring]);
    } else {
      polygons[polygons.length - 1].push(ring);
    }
  }

  return {
    type: "Feature",
    properties: { name: `省级区域${featureIndex + 1}` },
    geometry: {
      type: polygons.length === 1 ? "Polygon" : "MultiPolygon",
      coordinates: polygons.length === 1 ? polygons[0] : polygons,
    },
  };
}

const features = [];
let cursor = 100;
while (cursor + 8 <= buffer.length) {
  const contentLength = buffer.readInt32BE(cursor + 4) * 2;
  const contentOffset = cursor + 8;
  if (contentOffset + contentLength > buffer.length) break;
  const feature = readPolygon(contentOffset, contentLength, features.length);
  if (feature) features.push(feature);
  cursor = contentOffset + contentLength;
}

const geoJson = { type: "FeatureCollection", features };
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(
  target,
  `window.CRAB_CHINA_GEOJSON=${JSON.stringify(geoJson)};\n`,
  "utf8",
);
console.log(JSON.stringify({ source, target, features: features.length }));
