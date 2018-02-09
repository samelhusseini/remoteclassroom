from google.appengine.ext import vendor
import sys, os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))

vendor.add('lib')