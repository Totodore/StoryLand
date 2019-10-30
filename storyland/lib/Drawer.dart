import 'package:flutter/material.dart';

class CustomDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: <Widget>[
          Container(
            child: DrawerHeader(
              child: Center(
                child: Text("StoryLand", 
                  style: TextStyle(
                    fontFamily: "MarckScript",
                    fontWeight: FontWeight.bold,
                    fontSize: 40,
                  )
                ),
              )
            ),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.black,
                  Color(0xffb80eaf)
                ],
              )
            ),
          ),
          ListTile(
            leading: Icon(Icons.book),
            title: Text("Violence Éternelle"),
            onTap: () {
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: Icon(Icons.book),
            title: Text("Aube et Aurore"),
            onTap: () {
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: Icon(Icons.book),
            title: Text("Poussière de Joie"),
            onTap: () {
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: Icon(Icons.info),
            title: Text("Informations"),
            onTap: () {
              Navigator.pop(context);
            },
          )
        ],
      ),
    );
  }
}