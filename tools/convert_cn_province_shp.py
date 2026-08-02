import json
import struct
from pathlib import Path


SOURCE_DIR = Path(r"D:\Desktop\竞赛\易智瑞\date\中国_省\中国_省")
SOURCE_BASE = SOURCE_DIR / "中国_省-MULTIPOLYGON"
OUTPUT = Path(r"D:\aaaaaaaaa\ArcGIS pro\github-pages-crab-search-trends\assets\chart11-china-map\china-provinces.json")


def read_names():
    with SOURCE_BASE.with_suffix(".dbf").open("rb") as file:
        header = file.read(32)
        record_count = struct.unpack("<I", header[4:8])[0]
        header_length = struct.unpack("<H", header[8:10])[0]
        record_length = struct.unpack("<H", header[10:12])[0]
        field_count = (header_length - 33) // 32
        fields = [file.read(32) for _ in range(field_count)]
        file.read(1)
        name_width = fields[0][16]
        names = []
        for _ in range(record_count):
            record = file.read(record_length)
            names.append(record[1:1 + name_width].decode("utf-8").strip())
        return names


def read_shapes():
    names = read_names()
    shapes = []
    with SOURCE_BASE.with_suffix(".shp").open("rb") as file:
        file.read(100)
        for name in names:
            record_header = file.read(8)
            if len(record_header) != 8:
                break
            _, content_length = struct.unpack(">2i", record_header)
            content = file.read(content_length * 2)
            shape_type = struct.unpack("<i", content[:4])[0]
            if shape_type != 5:
                raise ValueError(f"Expected Polygon shape type 5, got {shape_type}")
            part_count = struct.unpack("<i", content[36:40])[0]
            point_count = struct.unpack("<i", content[40:44])[0]
            parts_offset = 44
            parts = [
                struct.unpack("<i", content[parts_offset + index * 4:parts_offset + index * 4 + 4])[0]
                for index in range(part_count)
            ]
            points_offset = parts_offset + part_count * 4
            points = [
                list(struct.unpack("<2d", content[points_offset + index * 16:points_offset + index * 16 + 16]))
                for index in range(point_count)
            ]
            rings = []
            for index, start in enumerate(parts):
                end = parts[index + 1] if index + 1 < len(parts) else point_count
                ring = points[start:end]
                if ring and ring[0] != ring[-1]:
                    ring.append(ring[0])
                if ring:
                    rings.append([ring])
            all_points = [point for polygon in rings for ring in polygon for point in ring]
            min_x = min(point[0] for point in all_points)
            max_x = max(point[0] for point in all_points)
            min_y = min(point[1] for point in all_points)
            max_y = max(point[1] for point in all_points)
            shapes.append({
                "type": "Feature",
                "properties": {
                    "name": name,
                    "center": [(min_x + max_x) / 2, (min_y + max_y) / 2],
                },
                "geometry": {"type": "MultiPolygon", "coordinates": rings},
            })
    return shapes


OUTPUT.parent.mkdir(parents=True, exist_ok=True)
geojson = {
    "type": "FeatureCollection",
    "name": "中国省级边界_用户提供_CGCS2000经纬度",
    "features": read_shapes(),
}
OUTPUT.write_text(json.dumps(geojson, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(f"wrote {OUTPUT} with {len(geojson['features'])} features")
