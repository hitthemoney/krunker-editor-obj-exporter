// ==UserScript==
// @name         Krunker Map OBJ Exporter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Krunker Map Downloader. https://hitthemoney.com
// @author       hitthemoney
// @match        https://krunker.io/editor.html*
// @grant        none
// ==/UserScript==

! function () {

    window.THREE = T3D.THREE

    /**
     * @author mrdoob / http://mrdoob.com/
     */

    THREE.OBJExporter = function () {};

    THREE.OBJExporter.prototype = {

        constructor: THREE.OBJExporter,

        parse: function (object, texturesFilePath, mtlFileName = 'objmaterial') {

            var output = '';
            var materials = {};

            var indexVertex = 0;
            var indexVertexUvs = 0;
            var indexNormals = 0;

            output += 'mtllib ' + mtlFileName + '.mtl\n';

            var vertex = new THREE.Vector3();
            var normal = new THREE.Vector3();
            var uv = new THREE.Vector2();

            var i, j, l, m, face = [];

            var parseMesh = function (mesh) {

                var nbVertex = 0;
                var nbNormals = 0;
                var nbVertexUvs = 0;

                var geometry = mesh.geometry;
                var material = mesh.material;

                var normalMatrixWorld = new THREE.Matrix3();

                if (geometry instanceof THREE.Geometry) {

                    geometry = new THREE.BufferGeometry().setFromObject(mesh);

                }

                if (geometry instanceof THREE.BufferGeometry) {

                    // shortcuts
                    var vertices = geometry.getAttribute('position');
                    var normals = geometry.getAttribute('normal');
                    var uvs = geometry.getAttribute('uv');
                    var indices = geometry.getIndex();

                    // name of the mesh object
                    output += 'o ' + mesh.name + '\n';

                    // vertices

                    if (vertices !== undefined) {

                        for (i = 0, l = vertices.count; i < l; i++, nbVertex++) {

                            vertex.x = vertices.getX(i);
                            vertex.y = vertices.getY(i);
                            vertex.z = vertices.getZ(i);

                            // transfrom the vertex to world space
                            vertex.applyMatrix4(mesh.matrixWorld);

                            // transform the vertex to export format
                            output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';

                        }

                    }

                    // uvs

                    if (uvs !== undefined) {

                        for (i = 0, l = uvs.count; i < l; i++, nbVertexUvs++) {

                            uv.x = uvs.getX(i);
                            uv.y = uvs.getY(i);

                            // transform the uv to export format
                            output += 'vt ' + uv.x + ' ' + uv.y + '\n';

                        }

                    }

                    // normals

                    if (normals !== undefined) {

                        normalMatrixWorld.getNormalMatrix(mesh.matrixWorld);

                        for (i = 0, l = normals.count; i < l; i++, nbNormals++) {

                            normal.x = normals.getX(i);
                            normal.y = normals.getY(i);
                            normal.z = normals.getZ(i);

                            // transfrom the normal to world space
                            normal.applyMatrix3(normalMatrixWorld);

                            // transform the normal to export format
                            output += 'vn ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';

                        }

                    }

                    // material

                    if (material.name !== '')
                        output += 'usemtl ' + material.name + '\n';
                    else
                        output += 'usemtl material' + material.id + '\n';

                    materials[material.id] = material;

                    // faces

                    if (indices !== null) {

                        for (i = 0, l = indices.count; i < l; i += 3) {

                            for (m = 0; m < 3; m++) {

                                j = indices.getX(i + m) + 1;

                                face[m] = (indexVertex + j) + '/' + (uvs ? (indexVertexUvs + j) : '') + '/' + (indexNormals + j);

                            }

                            // transform the face to export format
                            output += 'f ' + face.join(' ') + "\n";

                        }

                    } else {

                        for (i = 0, l = vertices.count; i < l; i += 3) {

                            for (m = 0; m < 3; m++) {

                                j = i + m + 1;

                                face[m] = (indexVertex + j) + '/' + (uvs ? (indexVertexUvs + j) : '') + '/' + (indexNormals + j);

                            }

                            // transform the face to export format
                            output += 'f ' + face.join(' ') + "\n";

                        }

                    }

                } else {

                    console.warn('THREE.OBJExporter.parseMesh(): geometry type unsupported', geometry);

                }

                // update index
                indexVertex += nbVertex;
                indexVertexUvs += nbVertexUvs;
                indexNormals += nbNormals;

            };

            var parseLine = function (line) {

                var nbVertex = 0;

                var geometry = line.geometry;
                var type = line.type;

                if (geometry instanceof THREE.Geometry) {

                    geometry = new THREE.BufferGeometry().setFromObject(line);

                }

                if (geometry instanceof THREE.BufferGeometry) {

                    // shortcuts
                    var vertices = geometry.getAttribute('position');
                    var indices = geometry.getIndex();

                    // name of the line object
                    output += 'o ' + line.name + '\n';

                    if (vertices !== undefined) {

                        for (i = 0, l = vertices.count; i < l; i++, nbVertex++) {

                            vertex.x = vertices.getX(i);
                            vertex.y = vertices.getY(i);
                            vertex.z = vertices.getZ(i);

                            // transfrom the vertex to world space
                            vertex.applyMatrix4(line.matrixWorld);

                            // transform the vertex to export format
                            output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';

                        }

                    }

                    if (type === 'Line') {

                        output += 'l ';

                        for (j = 1, l = vertices.count; j <= l; j++) {

                            output += (indexVertex + j) + ' ';

                        }

                        output += '\n';

                    }

                    if (type === 'LineSegments') {

                        for (j = 1, k = j + 1, l = vertices.count; j < l; j += 2, k = j + 1) {

                            output += 'l ' + (indexVertex + j) + ' ' + (indexVertex + k) + '\n';

                        }

                    }

                } else {

                    console.warn('THREE.OBJExporter.parseLine(): geometry type unsupported', geometry);

                }

                // update index
                indexVertex += nbVertex;

            };

            object.traverse(function (child) {

                if (child instanceof THREE.Mesh) {

                    //if (child.visibility === true || showHidden) {
                    parseMesh(child);
                    //}

                }

                if (child instanceof THREE.Line) {

                    parseLine(child);

                }

            });

            // mtl output

            var mtlOutput = '';

            for (var key in materials) {

                var mat = materials[key];

                if (mat.name !== '')
                    mtlOutput += 'newmtl ' + mat.name + '\n';
                else
                    mtlOutput += 'newmtl material' + mat.id + '\n';

                mtlOutput += 'Ns 10.0000\n';
                mtlOutput += 'Ni 1.5000\n';
                mtlOutput += 'd 1.0000\n';
                mtlOutput += 'Tr 0.0000\n';
                mtlOutput += 'Tf 1.0000 1.0000 1.0000\n';
                mtlOutput += 'illum 2\n';
                mtlOutput += 'Ka ' + mat.color.r + ' ' + mat.color.g + ' ' + mat.color.b + ' ' + '\n';
                mtlOutput += 'Kd ' + mat.color.r + ' ' + mat.color.g + ' ' + mat.color.b + ' ' + '\n';
                mtlOutput += 'Ks 0.0000 0.0000 0.0000\n';
                mtlOutput += 'Ke 0.0000 0.0000 0.0000\n';

                if (mat.map && mat.map instanceof THREE.Texture) {
                    if (texturesFilePath !== undefined) {
                        try {

                            var imgUrl = mat.map.image.currentSrc.replace("https://cors-anywhere.herokuapp.com/", "").split("?build=")[0];

                            var file = texturesFilePath + imgUrl.replace("https://assets.krunker.io", "")

                            mtlOutput += 'map_Ka ' + file + '\n';
                            mtlOutput += 'map_Kd ' + file + '\n';

                        } catch (err) {

                        }

                    }
                }

            }

            return {
                obj: output,
                mtl: mtlOutput
            }

        }

    };

    window.objectToObj = (mesh, texturesFilePath, mtlFileName = 'objmaterial') => {
        var exporter = new THREE.OBJExporter();
        if (Array.isArray(mesh)) {
            let exscene = new THREE.Scene()
            for (i = 0; i < mesh.length; i++) {
                exscene.add(mesh[i])
            }
            T3D.importMap(T3D.getMapExport())
            return exporter.parse(exscene, texturesFilePath, mtlFileName);
        } else {
            T3D.importMap(T3D.getMapExport())
            return exporter.parse(mesh, texturesFilePath, mtlFileName);
        }
    }

    window.downloadSceneAsObj = (texturesFilePath, mtlFileName = 'objmaterial', objFileName = "obj") => {

        var data = window.objectToObj(T3D.objInsts, texturesFilePath, mtlFileName);

        var objBlob = new Blob([data.obj], {
            type: 'text/plain'
        })
        var mtlBlob = new Blob([data.mtl], {
            type: 'text/plain'
        })

        var downloadNode = document.createElement('a');
        
        downloadNode.setAttribute("href", URL.createObjectURL(objBlob));
        downloadNode.setAttribute("download", objFileName + ".obj");
        downloadNode.style.display = "none"
        document.body.appendChild(downloadNode);
        downloadNode.click();
        downloadNode.setAttribute("href", URL.createObjectURL(mtlBlob));
        downloadNode.setAttribute("download", mtlFileName + ".mtl");
        downloadNode.click();
        downloadNode.remove();
    }

    var btmPanel = document.getElementsByClassName("bottomPanel")[3];
    var exportObjNode = document.createElement("div");
    exportObjNode.innerHTML = "Export OBJ"
    exportObjNode.id = "exportObj";
    exportObjNode.className = "bottomButton"
    exportObjNode.onclick = function () {
        var mtlFileName = prompt("MTL File Name (Pressing cancel or no name will result in blank textures)")
        var objFileName = prompt("OBJ File Name")
        var texturesFilePath = prompt("Mod Folder File Path (Pressing cancel or an invalid path will result in blank image textures)\nexamples: /Users/johnappleseed/Desktop/KrunkerMod or for files in the same folder: KrunkerMod")
        alert("Changing file names can result in blank textures.")
        window.downloadSceneAsObj(texturesFilePath, mtlFileName, objFileName);
    }
    btmPanel.appendChild(exportObjNode);
}();
