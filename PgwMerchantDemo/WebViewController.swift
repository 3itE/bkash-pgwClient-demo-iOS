//
//  WebViewController.swift
//  PgwMerchantDemo
//
//  Created by Syed Washfi Ahmad on 24/6/18.
//  Copyright © 2018 bkash. All rights reserved.
//

import UIKit
import WebKit

class WebViewController: UIViewController {
        
    @IBOutlet weak var webview: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
//        let url = URL(string: "https://www.google.com")
//        let request=URLRequest(url: url!)
//        webview.load(request)
        let htmlPath = Bundle.main.path(forResource: "checkout", ofType: "html")
        let url = URL(fileURLWithPath: htmlPath!)
        let request = URLRequest(url: url)

        webview.load(request)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}

