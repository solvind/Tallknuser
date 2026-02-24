"""Blender script: create a gothic-style window with stone frame and mullions.

Usage in Blender:
1. Open Blender.
2. Switch to the Scripting workspace.
3. Load this file and run it.
4. A parametric gothic window will be generated at world origin.
"""

import bpy
import math


def clear_scene() -> None:
    """Remove all mesh objects from the current scene."""
    bpy.ops.object.select_all(action="DESELECT")
    for obj in list(bpy.data.objects):
        if obj.type == "MESH":
            obj.select_set(True)
    bpy.ops.object.delete()


def ensure_material(name: str, color: tuple[float, float, float, float]) -> bpy.types.Material:
    """Get or create a simple Principled BSDF material."""
    mat = bpy.data.materials.get(name)
    if mat is None:
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True

    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = 0.55
    return mat


def add_arch(width: float, height: float, depth: float, location=(0.0, 0.0, 0.0)) -> bpy.types.Object:
    """Create a pointed gothic arch profile and extrude it to depth."""
    w = width / 2.0
    shoulder_h = height * 0.62
    tip_h = height

    curve_data = bpy.data.curves.new(name="GothicArchCurve", type="CURVE")
    curve_data.dimensions = "2D"
    curve_data.fill_mode = "BOTH"

    spline = curve_data.splines.new(type="BEZIER")
    spline.bezier_points.add(4)

    # Points: left base, left shoulder, tip, right shoulder, right base
    coords = [
        (-w, 0.0, 0.0),
        (-w, 0.0, shoulder_h),
        (0.0, 0.0, tip_h),
        (w, 0.0, shoulder_h),
        (w, 0.0, 0.0),
    ]

    for bp, co in zip(spline.bezier_points, coords):
        bp.co = co
        bp.handle_left_type = "AUTO"
        bp.handle_right_type = "AUTO"

    spline.use_cyclic_u = True

    arch_obj = bpy.data.objects.new("GothicArch", curve_data)
    bpy.context.collection.objects.link(arch_obj)
    arch_obj.location = location

    curve_data.extrude = depth / 2.0
    curve_data.bevel_depth = 0.0
    bpy.context.view_layer.objects.active = arch_obj
    bpy.ops.object.convert(target="MESH")

    return arch_obj


def add_window_panel(width: float, height: float, depth: float, frame_thickness: float) -> bpy.types.Object:
    """Create glass panel inside the frame by scaling down the arch."""
    panel = add_arch(
        width=width - frame_thickness * 1.8,
        height=height - frame_thickness * 1.6,
        depth=depth * 0.4,
        location=(0.0, 0.0, frame_thickness * 0.2),
    )
    panel.name = "GlassPanel"
    return panel


def add_mullions(width: float, height: float, depth: float, frame_thickness: float) -> list[bpy.types.Object]:
    """Add vertical and radial mullions for gothic style detailing."""
    mullions: list[bpy.types.Object] = []

    mullion_width = frame_thickness * 0.28
    mullion_depth = depth * 0.55
    shoulder_h = height * 0.62

    # Vertical mullions in the rectangular lower part.
    x_positions = [-width * 0.2, 0.0, width * 0.2]
    for idx, x_pos in enumerate(x_positions, start=1):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x_pos, 0.0, shoulder_h * 0.45))
        mullion = bpy.context.active_object
        mullion.name = f"MullionVertical_{idx}"
        mullion.scale = (
            mullion_width,
            mullion_depth / 2.0,
            shoulder_h * 0.45,
        )
        mullions.append(mullion)

    # Three short tracery bars radiating toward the arch tip.
    start_h = shoulder_h + (height - shoulder_h) * 0.15
    length = (height - start_h) * 0.95
    for idx, angle_deg in enumerate([-24, 0, 24], start=1):
        angle = math.radians(angle_deg)
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, 0.0, start_h + length * 0.4))
        bar = bpy.context.active_object
        bar.name = f"Tracery_{idx}"
        bar.scale = (mullion_width * 0.8, mullion_depth / 2.0, length / 2.0)
        bar.rotation_euler[1] = angle
        mullions.append(bar)

    return mullions


def build_gothic_window(
    width: float = 2.4,
    height: float = 4.0,
    depth: float = 0.24,
    frame_thickness: float = 0.2,
    clear_existing_meshes: bool = True,
) -> dict[str, bpy.types.Object | list[bpy.types.Object]]:
    """Build a complete gothic window assembly."""
    if clear_existing_meshes:
        clear_scene()

    frame = add_arch(width=width, height=height, depth=depth)
    frame.name = "WindowFrame"

    panel = add_window_panel(width=width, height=height, depth=depth, frame_thickness=frame_thickness)
    mullions = add_mullions(width=width, height=height, depth=depth, frame_thickness=frame_thickness)

    stone = ensure_material("Stone", (0.72, 0.70, 0.66, 1.0))
    glass = ensure_material("Glass", (0.60, 0.74, 0.96, 1.0))
    glass.blend_method = "BLEND"
    glass_bsdf = glass.node_tree.nodes.get("Principled BSDF")
    if glass_bsdf:
        glass_bsdf.inputs["Transmission Weight"].default_value = 0.92
        glass_bsdf.inputs["Roughness"].default_value = 0.08
        glass_bsdf.inputs["IOR"].default_value = 1.45

    frame.data.materials.append(stone)
    panel.data.materials.append(glass)
    for obj in mullions:
        obj.data.materials.append(stone)

    # Join frame + mullions for easier manipulation, keep glass separate.
    bpy.ops.object.select_all(action="DESELECT")
    frame.select_set(True)
    for obj in mullions:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = frame
    bpy.ops.object.join()
    frame.name = "GothicWindowFrame"

    return {"frame": frame, "panel": panel, "mullions": mullions}


if __name__ == "__main__":
    build_gothic_window()
