# =========================================== #
# Made by hitthemoney#5719 and GNU/Ninja#7650 #
#           (Mostly GNU/Ninja#7650)           #
# =========================================== #

# Copy and paste this into blender console after loading a krunker map.

import bpy

for i in bpy.data.materials:
    
    try:
        nodes = i.node_tree.nodes
        node = nodes.new('ShaderNodeMixRGB')
        
        node.inputs[0].default_value = 1
        node.blend_type = 'MULTIPLY'
        
        
        node2 = nodes.new('ShaderNodeRGB')
        node2.outputs[0].default_value = i.diffuse_color
        
        i.node_tree.links.new(i.node_tree.nodes["Image Texture"].outputs[0], node.inputs[1])
        i.node_tree.links.new(node2.outputs[0], node.inputs[2])
        
        i.node_tree.links.new(node.outputs[0], i.node_tree.nodes["Principled BSDF"].inputs[0])

        
        i.node_tree.nodes["Image Texture"].interpolation = 'Closest'
        
        
    except:
        pass