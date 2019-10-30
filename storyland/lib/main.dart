import 'package:flutter/material.dart';
import 'package:xml/xml.dart';
import 'Drawer.dart';

void main() => runApp(StoryLand());

class StoryLand extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'StoryLand',
      home: Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: Text("StoryLand"),
          backgroundColor: Color(0xffb80eaf),
        ),
        drawer: CustomDrawer(),
        body: StatefulFolder(),
      ),
    );
  }
}
class Folder {
  Folder({
    this.name,
    this.icon,
    this.isExpanded = false
  });
  String name;
  IconData icon;
  bool isExpanded;
}

List<Folder> generateFolders(int folderLength) {
  return List.generate(folderLength, (int index) {
    return Folder(
      name: "Folder Name", 
      icon: Icons.folder,
    );
  });
}
class StatefulFolder extends StatefulWidget {
  StatefulFolder({Key key}) : super(key: key);

  @override
  _StatefulFolderState createState() => _StatefulFolderState();
}

class _StatefulFolderState extends State<StatefulFolder> {
  List<Folder> _data = generateFolders(5);

  @override 
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        child: _buildPanel(),
      ),
    );
  }

  Widget _buildPanel() {
    return ExpansionPanelList(
      expansionCallback: (int index, bool isExpanded) {
        setState(() {
          _data[index].isExpanded = !isExpanded;
        });
      },
      children: _data.map<ExpansionPanel>((Folder folder) {
        return ExpansionPanel(
          headerBuilder: (BuildContext context, bool isExpanded) {
            return ListTile(
              title: Text(folder.name),
              leading: Icon(folder.icon),
            );
          },
          body: ListTile(
            title: Text("TROLILOLOLI"),
            leading: Icon(Icons.folder_open),
            onTap: () {
              setState(() {
                _data.removeWhere((currentFolder) => folder == currentFolder);
              });
            },
          ),
          isExpanded: folder.isExpanded,
        );
      }).toList(),
    );
  }
}