//
//  ContentView.swift
//  WebViewLab
//
//  Created by Leticia Ponce on 12/10/26.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        WebViewContainer(
            url: URL(string: "http://localhost:8080")!
        )
        .ignoresSafeArea()
    }
}
