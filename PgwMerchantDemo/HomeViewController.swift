//
//  ViewController.swift
//  PgwMerchantDemo
//
//  Created by Syed Washfi Ahmad on 24/6/18.
//  Copyright © 2018 bkash. All rights reserved.
//

import UIKit

class HomeViewController: UIViewController {
    
    @IBAction func nextViewButtonPressed(_ sender: Any) {
        print("Button pressed")
        self.performSegue(withIdentifier: "WebViewSegue", sender: self)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        print("View has loaded")
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

